import {
  chSql,
  convertCHDataTypeToJSType,
  filterColumnMetaByType,
  renderChartConfig,
  tableExpr
} from "./chunk-SS4AMLYH.mjs";
import "./chunk-TDNGARSY.mjs";
import "./chunk-FJAGTJBH.mjs";

// src/metadata.ts
var DEFAULT_MAX_ROWS_TO_READ = 3e6;
var MetadataCache = class {
  cache = /* @__PURE__ */ new Map();
  pendingQueries = /* @__PURE__ */ new Map();
  // this should be getOrUpdate... or just query to follow react query
  get(key) {
    return this.cache.get(key);
  }
  async getOrFetch(key, query) {
    const cachedValue = this.cache.get(key);
    if (cachedValue != null) {
      return cachedValue;
    }
    if (this.pendingQueries.has(key)) {
      return this.pendingQueries.get(key);
    }
    const queryPromise = query();
    this.pendingQueries.set(key, queryPromise);
    try {
      const result = await queryPromise;
      this.cache.set(key, result);
      return result;
    } finally {
      this.pendingQueries.delete(key);
    }
  }
  set(key, value) {
    return this.cache.set(key, value);
  }
  // TODO: This needs to be async, and use tanstack query on frontend for cache
  // TODO: Implement locks for refreshing
  // TODO: Shard cache by time
};
var Metadata = class {
  clickhouseClient;
  cache;
  constructor(clickhouseClient, cache) {
    this.clickhouseClient = clickhouseClient;
    this.cache = cache;
  }
  async queryTableMetadata({
    database,
    table,
    cache,
    connectionId
  }) {
    return cache.getOrFetch(`${database}.${table}.metadata`, async () => {
      const sql = chSql`SELECT * FROM system.tables where database = ${{ String: database }} AND name = ${{ String: table }}`;
      const json = await this.clickhouseClient.query({
        connectionId,
        query: sql.sql,
        query_params: sql.params
      }).then((res) => res.json());
      return json.data[0];
    });
  }
  async getColumns({
    databaseName,
    tableName,
    connectionId
  }) {
    return this.cache.getOrFetch(
      `${databaseName}.${tableName}.columns`,
      async () => {
        const sql = chSql`DESCRIBE ${tableExpr({ database: databaseName, table: tableName })}`;
        const columns = await this.clickhouseClient.query({
          query: sql.sql,
          query_params: sql.params,
          connectionId
        }).then((res) => res.json()).then((d) => d.data);
        return columns;
      }
    );
  }
  async getMaterializedColumnsLookupTable({
    databaseName,
    tableName,
    connectionId
  }) {
    const columns = await this.getColumns({
      databaseName,
      tableName,
      connectionId
    });
    return new Map(
      columns.filter(
        (c) => c.default_type === "MATERIALIZED" || c.default_type === "DEFAULT"
      ).map((c) => [c.default_expression, c.name])
    );
  }
  async getColumn({
    databaseName,
    tableName,
    column,
    matchLowercase = false,
    connectionId
  }) {
    const tableColumns = await this.getColumns({
      databaseName,
      tableName,
      connectionId
    });
    return tableColumns.filter((c) => {
      if (matchLowercase) {
        return c.name.toLowerCase() === column.toLowerCase();
      }
      return c.name === column;
    })[0];
  }
  async getMapKeys({
    databaseName,
    tableName,
    column,
    maxKeys = 1e3,
    connectionId,
    metricName
  }) {
    const cacheKey = metricName ? `${databaseName}.${tableName}.${column}.${metricName}.keys` : `${databaseName}.${tableName}.${column}.keys`;
    const cachedKeys = this.cache.get(cacheKey);
    if (cachedKeys != null) {
      return cachedKeys;
    }
    const colMeta = await this.getColumn({
      databaseName,
      tableName,
      column,
      connectionId
    });
    if (colMeta == null) {
      throw new Error(
        `Column ${column} not found in ${databaseName}.${tableName}`
      );
    }
    let strategy = "groupUniqArrayArray";
    if (colMeta.type.startsWith("Map(LowCardinality(String)")) {
      strategy = "lowCardinalityKeys";
    }
    const where = metricName ? chSql`WHERE MetricName=${{ String: metricName }}` : "";
    let sql;
    if (strategy === "groupUniqArrayArray") {
      sql = chSql`SELECT groupUniqArrayArray(${{ Int32: maxKeys }})(${{
        Identifier: column
      }}) as keysArr
      FROM ${tableExpr({ database: databaseName, table: tableName })} ${where}`;
    } else {
      sql = chSql`SELECT DISTINCT lowCardinalityKeys(arrayJoin(${{
        Identifier: column
      }}.keys)) as key
      FROM ${tableExpr({ database: databaseName, table: tableName })} ${where}
      LIMIT ${{
        Int32: maxKeys
      }}`;
    }
    return this.cache.getOrFetch(cacheKey, async () => {
      const keys = await this.clickhouseClient.query({
        query: sql.sql,
        query_params: sql.params,
        connectionId,
        clickhouse_settings: {
          max_rows_to_read: String(DEFAULT_MAX_ROWS_TO_READ),
          read_overflow_mode: "break"
        }
      }).then((res) => res.json()).then((d) => {
        let output;
        if (strategy === "groupUniqArrayArray") {
          output = d.data[0].keysArr;
        } else {
          output = d.data.map((row) => row.key);
        }
        return output.filter((r) => r);
      });
      return keys;
    });
  }
  async getMapValues({
    databaseName,
    tableName,
    column,
    key,
    maxValues = 20,
    connectionId
  }) {
    const cachedValues = this.cache.get(
      `${databaseName}.${tableName}.${column}.${key}.values`
    );
    if (cachedValues != null) {
      return cachedValues;
    }
    const sql = key ? chSql`
      SELECT DISTINCT ${{
      Identifier: column
    }}[${{ String: key }}] as value
      FROM ${tableExpr({ database: databaseName, table: tableName })}
      WHERE value != ''
      LIMIT ${{
      Int32: maxValues
    }}
    ` : chSql`
      SELECT DISTINCT ${{
      Identifier: column
    }} as value
      FROM ${tableExpr({ database: databaseName, table: tableName })}
      WHERE value != ''
      LIMIT ${{
      Int32: maxValues
    }}
    `;
    return this.cache.getOrFetch(
      `${databaseName}.${tableName}.${column}.${key}.values`,
      async () => {
        const values = await this.clickhouseClient.query({
          query: sql.sql,
          query_params: sql.params,
          connectionId,
          clickhouse_settings: {
            max_rows_to_read: String(DEFAULT_MAX_ROWS_TO_READ),
            read_overflow_mode: "break"
          }
        }).then((res) => res.json()).then((d) => d.data.map((row) => row.value));
        return values;
      }
    );
  }
  async getAllFields({
    databaseName,
    tableName,
    connectionId,
    metricName
  }) {
    const fields = [];
    const columns = await this.getColumns({
      databaseName,
      tableName,
      connectionId
    });
    for (const c of columns) {
      fields.push({
        path: [c.name],
        type: c.type,
        jsType: convertCHDataTypeToJSType(c.type)
      });
    }
    const mapColumns = filterColumnMetaByType(columns, ["map" /* Map */]) ?? [];
    await Promise.all(
      mapColumns.map(async (column) => {
        const keys = await this.getMapKeys({
          databaseName,
          tableName,
          column: column.name,
          connectionId,
          metricName
        });
        const match = column.type.match(/Map\(.+,\s*(.+)\)/);
        const chType = match?.[1] ?? "String";
        for (const key of keys) {
          fields.push({
            path: [column.name, key],
            type: chType,
            jsType: convertCHDataTypeToJSType(chType)
          });
        }
      })
    );
    return fields;
  }
  async getTableMetadata({
    databaseName,
    tableName,
    connectionId
  }) {
    const tableMetadata = await this.queryTableMetadata({
      cache: this.cache,
      database: databaseName,
      table: tableName,
      connectionId
    });
    if (tableMetadata.partition_key.startsWith("(") && tableMetadata.partition_key.endsWith(")")) {
      tableMetadata.partition_key = tableMetadata.partition_key.slice(1, -1);
    }
    return tableMetadata;
  }
  async getKeyValues({
    chartConfig,
    keys,
    limit = 20,
    disableRowLimit = false
  }) {
    return this.cache.getOrFetch(
      `${chartConfig.from.databaseName}.${chartConfig.from.tableName}.${keys.join(",")}.${chartConfig.dateRange.toString()}.${disableRowLimit}.values`,
      async () => {
        const sql = await renderChartConfig(
          {
            ...chartConfig,
            select: keys.map((k, i) => `groupUniqArray(${limit})(${k}) AS param${i}`).join(", ")
          },
          this
        );
        const json = await this.clickhouseClient.query({
          query: sql.sql,
          query_params: sql.params,
          connectionId: chartConfig.connection,
          clickhouse_settings: !disableRowLimit ? {
            max_rows_to_read: String(DEFAULT_MAX_ROWS_TO_READ),
            read_overflow_mode: "break"
          } : void 0
        }).then((res) => res.json());
        return Object.entries(json?.data?.[0]).map(([key, value]) => ({
          key: keys[parseInt(key.replace("param", ""))],
          value: value?.filter(Boolean)
          // remove nulls
        }));
      }
    );
  }
};
function tcFromChartConfig(config) {
  return {
    databaseName: config?.from?.databaseName ?? "",
    tableName: config?.from?.tableName ?? "",
    connectionId: config?.connection ?? ""
  };
}
function tcFromSource(source) {
  return {
    databaseName: source?.from?.databaseName ?? "",
    tableName: source?.from?.tableName ?? "",
    connectionId: source?.connection ?? ""
  };
}
var __LOCAL_CACHE__ = new MetadataCache();
var getMetadata = (clickhouseClient) => new Metadata(clickhouseClient, __LOCAL_CACHE__);
export {
  DEFAULT_MAX_ROWS_TO_READ,
  Metadata,
  MetadataCache,
  getMetadata,
  tcFromChartConfig,
  tcFromSource
};
