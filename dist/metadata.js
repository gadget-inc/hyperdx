"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } var _class;





var _chunkYBAEJAJBjs = require('./chunk-YBAEJAJB.js');
require('./chunk-E5P4KR33.js');
require('./chunk-3VOIEFG6.js');

// src/metadata.ts
var DEFAULT_MAX_ROWS_TO_READ = 3e6;
var MetadataCache = (_class = class {constructor() { _class.prototype.__init.call(this);_class.prototype.__init2.call(this); }
  __init() {this.cache = /* @__PURE__ */ new Map()}
  __init2() {this.pendingQueries = /* @__PURE__ */ new Map()}
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
}, _class);
var Metadata = class {
  
  
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
      const sql = _chunkYBAEJAJBjs.chSql`SELECT * FROM system.tables where database = ${{ String: database }} AND name = ${{ String: table }}`;
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
        const sql = _chunkYBAEJAJBjs.chSql`DESCRIBE ${_chunkYBAEJAJBjs.tableExpr.call(void 0, { database: databaseName, table: tableName })}`;
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
    const where = metricName ? _chunkYBAEJAJBjs.chSql`WHERE MetricName=${{ String: metricName }}` : "";
    let sql;
    if (strategy === "groupUniqArrayArray") {
      sql = _chunkYBAEJAJBjs.chSql`SELECT groupUniqArrayArray(${{ Int32: maxKeys }})(${{
        Identifier: column
      }}) as keysArr
      FROM ${_chunkYBAEJAJBjs.tableExpr.call(void 0, { database: databaseName, table: tableName })} ${where}`;
    } else {
      sql = _chunkYBAEJAJBjs.chSql`SELECT DISTINCT lowCardinalityKeys(arrayJoin(${{
        Identifier: column
      }}.keys)) as key
      FROM ${_chunkYBAEJAJBjs.tableExpr.call(void 0, { database: databaseName, table: tableName })} ${where}
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
    const sql = key ? _chunkYBAEJAJBjs.chSql`
      SELECT DISTINCT ${{
      Identifier: column
    }}[${{ String: key }}] as value
      FROM ${_chunkYBAEJAJBjs.tableExpr.call(void 0, { database: databaseName, table: tableName })}
      WHERE value != ''
      LIMIT ${{
      Int32: maxValues
    }}
    ` : _chunkYBAEJAJBjs.chSql`
      SELECT DISTINCT ${{
      Identifier: column
    }} as value
      FROM ${_chunkYBAEJAJBjs.tableExpr.call(void 0, { database: databaseName, table: tableName })}
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
        jsType: _chunkYBAEJAJBjs.convertCHDataTypeToJSType.call(void 0, c.type)
      });
    }
    const mapColumns = _nullishCoalesce(_chunkYBAEJAJBjs.filterColumnMetaByType.call(void 0, columns, ["map" /* Map */]), () => ( []));
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
        const chType = _nullishCoalesce(_optionalChain([match, 'optionalAccess', _ => _[1]]), () => ( "String"));
        for (const key of keys) {
          fields.push({
            path: [column.name, key],
            type: chType,
            jsType: _chunkYBAEJAJBjs.convertCHDataTypeToJSType.call(void 0, chType)
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
        const sql = await _chunkYBAEJAJBjs.renderChartConfig.call(void 0, 
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
        return Object.entries(_optionalChain([json, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3[0]])).map(([key, value]) => ({
          key: keys[parseInt(key.replace("param", ""))],
          value: _optionalChain([value, 'optionalAccess', _4 => _4.filter, 'call', _5 => _5(Boolean)])
          // remove nulls
        }));
      }
    );
  }
};
function tcFromChartConfig(config) {
  return {
    databaseName: _nullishCoalesce(_optionalChain([config, 'optionalAccess', _6 => _6.from, 'optionalAccess', _7 => _7.databaseName]), () => ( "")),
    tableName: _nullishCoalesce(_optionalChain([config, 'optionalAccess', _8 => _8.from, 'optionalAccess', _9 => _9.tableName]), () => ( "")),
    connectionId: _nullishCoalesce(_optionalChain([config, 'optionalAccess', _10 => _10.connection]), () => ( ""))
  };
}
function tcFromSource(source) {
  return {
    databaseName: _nullishCoalesce(_optionalChain([source, 'optionalAccess', _11 => _11.from, 'optionalAccess', _12 => _12.databaseName]), () => ( "")),
    tableName: _nullishCoalesce(_optionalChain([source, 'optionalAccess', _13 => _13.from, 'optionalAccess', _14 => _14.tableName]), () => ( "")),
    connectionId: _nullishCoalesce(_optionalChain([source, 'optionalAccess', _15 => _15.connection]), () => ( ""))
  };
}
var __LOCAL_CACHE__ = new MetadataCache();
var getMetadata = (clickhouseClient) => new Metadata(clickhouseClient, __LOCAL_CACHE__);







exports.DEFAULT_MAX_ROWS_TO_READ = DEFAULT_MAX_ROWS_TO_READ; exports.Metadata = Metadata; exports.MetadataCache = MetadataCache; exports.getMetadata = getMetadata; exports.tcFromChartConfig = tcFromChartConfig; exports.tcFromSource = tcFromSource;
