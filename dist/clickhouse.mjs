import * as SQLParser from "node-sql-parser";
import objectHash from "object-hash";
import {
  renderChartConfig,
  setChartSelectsAlias,
  splitChartConfigs
} from "@/renderChartConfig";
import { hashCode, isBrowser, isNode } from "@/utils";
var JSDataType = /* @__PURE__ */ ((JSDataType2) => {
  JSDataType2["Array"] = "array";
  JSDataType2["Date"] = "date";
  JSDataType2["Map"] = "map";
  JSDataType2["Number"] = "number";
  JSDataType2["String"] = "string";
  JSDataType2["Bool"] = "bool";
  JSDataType2["JSON"] = "json";
  JSDataType2["Dynamic"] = "dynamic";
  return JSDataType2;
})(JSDataType || {});
const getResponseHeaders = (response) => {
  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
};
const convertCHDataTypeToJSType = (dataType) => {
  if (dataType.startsWith("Date")) {
    return "date" /* Date */;
  } else if (dataType.startsWith("Map")) {
    return "map" /* Map */;
  } else if (dataType.startsWith("Array")) {
    return "array" /* Array */;
  } else if (dataType.startsWith("Int") || dataType.startsWith("UInt") || dataType.startsWith("Float") || // Nullable types are possible (charts)
  dataType.startsWith("Nullable(Int") || dataType.startsWith("Nullable(UInt") || dataType.startsWith("Nullable(Float")) {
    return "number" /* Number */;
  } else if (dataType.startsWith("String") || dataType.startsWith("FixedString") || dataType.startsWith("Enum") || dataType.startsWith("UUID") || dataType.startsWith("IPv4") || dataType.startsWith("IPv6")) {
    return "string" /* String */;
  } else if (dataType === "Bool") {
    return "bool" /* Bool */;
  } else if (dataType.startsWith("JSON")) {
    return "json" /* JSON */;
  } else if (dataType.startsWith("Dynamic")) {
    return "dynamic" /* Dynamic */;
  } else if (dataType.startsWith("LowCardinality")) {
    return convertCHDataTypeToJSType(dataType.slice(15, -1));
  }
  return null;
};
const convertCHTypeToPrimitiveJSType = (dataType) => {
  const jsType = convertCHDataTypeToJSType(dataType);
  if (jsType === "map" /* Map */ || jsType === "array" /* Array */) {
    throw new Error("Map type is not a primitive type");
  } else if (jsType === "date" /* Date */) {
    return "number" /* Number */;
  }
  return jsType;
};
const hash = (input) => Math.abs(hashCode(`${input}`));
const paramHash = (str) => {
  return `HYPERDX_PARAM_${hash(str)}`;
};
const chSql = (strings, ...values) => {
  const sql = strings.map((str, i) => {
    const value = values[i];
    return str + (value == null ? "" : typeof value === "string" ? value : "UNSAFE_RAW_SQL" in value ? value.UNSAFE_RAW_SQL : Array.isArray(value) ? value.map((v) => v.sql).join("") : "sql" in value ? value.sql : "Identifier" in value ? `{${paramHash(value.Identifier)}:Identifier}` : "String" in value ? `{${paramHash(value.String)}:String}` : "Float32" in value ? `{${paramHash(value.Float32)}:Float32}` : "Float64" in value ? `{${paramHash(value.Float64)}:Float64}` : "Int32" in value ? `{${paramHash(value.Int32)}:Int32}` : "Int64" in value ? `{${paramHash(value.Int64)}:Int64}` : "");
  }).join("");
  return {
    sql,
    params: values.reduce((acc, value) => {
      return {
        ...acc,
        ...value == null || typeof value === "string" || "UNSAFE_RAW_SQL" in value ? {} : Array.isArray(value) ? value.reduce((acc2, v) => {
          Object.assign(acc2, v.params);
          return acc2;
        }, {}) : "params" in value ? value.params : "Identifier" in value ? { [paramHash(value.Identifier)]: value.Identifier } : "String" in value ? { [paramHash(value.String)]: value.String } : "Float32" in value ? { [paramHash(value.Float32)]: value.Float32 } : "Float64" in value ? { [paramHash(value.Float64)]: value.Float64 } : "Int32" in value ? { [paramHash(value.Int32)]: value.Int32 } : "Int64" in value ? { [paramHash(value.Int64)]: value.Int64 } : {}
      };
    }, {})
  };
};
const concatChSql = (sep, ...args) => {
  return args.reduce(
    (acc, arg) => {
      if (Array.isArray(arg)) {
        if (arg.length === 0) {
          return acc;
        }
        acc.sql += (acc.sql.length > 0 ? sep : "") + arg.map((a) => a.sql).filter(Boolean).join(sep);
        acc.params = arg.reduce((acc2, a) => {
          Object.assign(acc2, a.params);
          return acc2;
        }, acc.params);
      } else if (arg.sql.length > 0) {
        acc.sql += `${acc.sql.length > 0 ? sep : ""}${arg.sql}`;
        Object.assign(acc.params, arg.params);
      }
      return acc;
    },
    { sql: "", params: {} }
  );
};
const isChSqlEmpty = (chSql2) => {
  if (Array.isArray(chSql2)) {
    return chSql2.every((c) => c.sql.length === 0);
  }
  return chSql2.sql.length === 0;
};
const wrapChSqlIfNotEmpty = (sql, left, right) => {
  if (isChSqlEmpty(sql)) {
    return [];
  }
  return chSql`${left}${sql}${right}`;
};
class ClickHouseQueryError extends Error {
  constructor(message, query) {
    super(message);
    this.query = query;
    this.name = "ClickHouseQueryError";
  }
}
function extractColumnReference(sql, maxIterations = 10) {
  let iterations = 0;
  while (/\w+\([^()]*\)/.test(sql) && iterations < maxIterations) {
    sql = sql.replace(/\w+\(([^()]*)\)/, "$1");
    iterations++;
  }
  return iterations < maxIterations ? sql.trim() : null;
}
const castToNumber = (value) => {
  if (typeof value === "string") {
    if (value.trim() === "") {
      return NaN;
    }
    return Number(value);
  }
  return value;
};
const computeRatio = (numeratorInput, denominatorInput) => {
  const numerator = castToNumber(numeratorInput);
  const denominator = castToNumber(denominatorInput);
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    return NaN;
  }
  return numerator / denominator;
};
const computeResultSetRatio = (resultSet) => {
  const _meta = resultSet.meta;
  const _data = resultSet.data;
  const timestampColumn = inferTimestampColumn(_meta ?? []);
  const _restColumns = _meta?.filter((m) => m.name !== timestampColumn?.name);
  const firstColumn = _restColumns?.[0];
  const secondColumn = _restColumns?.[1];
  if (!firstColumn || !secondColumn) {
    throw new Error(
      `Unable to compute ratio - meta information: ${JSON.stringify(_meta)}.`
    );
  }
  const ratioColumnName = `${firstColumn.name}/${secondColumn.name}`;
  const result = {
    ...resultSet,
    data: _data.map((row) => ({
      [ratioColumnName]: computeRatio(
        row[firstColumn.name],
        row[secondColumn.name]
      ),
      ...timestampColumn ? {
        [timestampColumn.name]: row[timestampColumn.name]
      } : {}
    })),
    meta: [
      {
        name: ratioColumnName,
        type: "Float64"
      },
      ...timestampColumn ? [
        {
          name: timestampColumn.name,
          type: timestampColumn.type
        }
      ] : []
    ]
  };
  return result;
};
const localModeFetch = (input, init) => {
  if (!init) init = {};
  const url = new URL(
    input instanceof URL ? input : input instanceof Request ? input.url : input
  );
  const auth = init.headers?.["Authorization"];
  const [username, password] = window.atob(auth.substring("Bearer".length)).split(":");
  delete init.headers?.["Authorization"];
  if (username) url.searchParams.set("user", username);
  if (password) url.searchParams.set("password", password);
  return fetch(`${url.toString()}`, init);
};
const standardModeFetch = (input, init) => {
  if (!init) init = {};
  delete init.headers?.["Authorization"];
  return fetch(input, init);
};
class ClickhouseClient {
  host;
  username;
  password;
  /*
   * Some clickhouse db's (the demo instance for example) make the
   * max_rows_to_read setting readonly and the query will fail if you try to
   * query with max_rows_to_read specified
   */
  maxRowReadOnly;
  constructor({ host, username, password }) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.maxRowReadOnly = false;
  }
  async query(props) {
    let attempts = 0;
    while (attempts < 2) {
      try {
        const res = await this.__query(props);
        return res;
      } catch (error) {
        if (!this.maxRowReadOnly && error.type === "READONLY" && error.message.includes("max_rows_to_read")) {
          this.maxRowReadOnly = true;
        } else {
          throw error;
        }
      }
      attempts++;
    }
    throw new Error("ClickHouseClient query impossible codepath");
  }
  // https://github.com/ClickHouse/clickhouse-js/blob/1ebdd39203730bb99fad4c88eac35d9a5e96b34a/packages/client-web/src/connection/web_connection.ts#L151
  async __query({
    query,
    format = "JSON",
    query_params = {},
    abort_signal,
    clickhouse_settings: external_clickhouse_settings,
    connectionId,
    queryId
  }) {
    let debugSql = "";
    try {
      debugSql = parameterizedQueryToSql({ sql: query, params: query_params });
    } catch (e) {
      debugSql = query;
    }
    let _url = this.host;
    let clickhouse_settings = structuredClone(
      external_clickhouse_settings || {}
    );
    if (clickhouse_settings?.max_rows_to_read && this.maxRowReadOnly) {
      delete clickhouse_settings["max_rows_to_read"];
    }
    if (isBrowser) {
      const { createClient } = await import("@clickhouse/client-web");
      clickhouse_settings = {
        date_time_output_format: "iso",
        wait_end_of_query: 0,
        cancel_http_readonly_queries_on_client_close: 1,
        ...clickhouse_settings
      };
      const http_headers = {
        ...connectionId && connectionId !== "local" ? { "x-hyperdx-connection-id": connectionId } : {}
      };
      let myFetch;
      const isLocalMode = this.username != null && this.password != null;
      if (isLocalMode) {
        myFetch = localModeFetch;
        clickhouse_settings.add_http_cors_header = 1;
      } else {
        _url = `${window.origin}${this.host}`;
        myFetch = standardModeFetch;
      }
      const url = new URL(_url);
      const clickhouseClient = createClient({
        url: url.origin,
        pathname: url.pathname,
        http_headers,
        clickhouse_settings,
        username: this.username ?? "",
        password: this.password ?? "",
        // Disable keep-alive to prevent multiple concurrent dashboard requests from exceeding the 64KB payload size limit.
        keep_alive: {
          enabled: false
        },
        fetch: myFetch
      });
      return clickhouseClient.query({
        query,
        query_params,
        format,
        abort_signal,
        clickhouse_settings,
        query_id: queryId
      });
    } else if (isNode) {
      const { createClient } = await import("@clickhouse/client");
      const _client = createClient({
        url: this.host,
        username: this.username,
        password: this.password
      });
      return _client.query({
        query,
        query_params,
        format,
        abort_signal,
        clickhouse_settings: {
          date_time_output_format: "iso",
          wait_end_of_query: 0,
          cancel_http_readonly_queries_on_client_close: 1,
          ...clickhouse_settings
        },
        query_id: queryId
      });
    } else {
      throw new Error(
        "ClickhouseClient is only supported in the browser or node environment"
      );
    }
  }
  // TODO: only used when multi-series 'metrics' is selected (no effects on the events chart)
  // eventually we want to generate union CTEs on the db side instead of computing it on the client side
  async queryChartConfig({
    config,
    metadata,
    opts
  }) {
    config = setChartSelectsAlias(config);
    const queries = await Promise.all(
      splitChartConfigs(config).map((c) => renderChartConfig(c, metadata))
    );
    const isTimeSeries = config.displayType === "line";
    const resultSets = await Promise.all(
      queries.map(async (query) => {
        const resp = await this.query({
          query: query.sql,
          query_params: query.params,
          format: "JSON",
          abort_signal: opts?.abort_signal,
          connectionId: config.connection,
          clickhouse_settings: opts?.clickhouse_settings
        });
        return resp.json();
      })
    );
    if (resultSets.length === 1) {
      return resultSets[0];
    } else if (resultSets.length > 1) {
      const metaSet = /* @__PURE__ */ new Map();
      const tsBucketMap = /* @__PURE__ */ new Map();
      for (const resultSet of resultSets) {
        if (Array.isArray(resultSet.meta)) {
          for (const meta of resultSet.meta) {
            const key = meta.name;
            if (!metaSet.has(key)) {
              metaSet.set(key, meta);
            }
          }
        }
        const timestampColumn = inferTimestampColumn(resultSet.meta ?? []);
        const numericColumn = inferNumericColumn(resultSet.meta ?? []);
        const numericColumnName = numericColumn?.[0]?.name;
        for (const row of resultSet.data) {
          const _rowWithoutValue = numericColumnName ? Object.fromEntries(
            Object.entries(row).filter(
              ([key]) => key !== numericColumnName
            )
          ) : { ...row };
          const ts = timestampColumn != null ? row[timestampColumn.name] : isTimeSeries ? objectHash(_rowWithoutValue) : "__FIXED_TIMESTAMP__";
          if (tsBucketMap.has(ts)) {
            const existingRow = tsBucketMap.get(ts);
            tsBucketMap.set(ts, {
              ...existingRow,
              ...row
            });
          } else {
            tsBucketMap.set(ts, row);
          }
        }
      }
      const isRatio = config.seriesReturnType === "ratio" && resultSets.length === 2;
      const _resultSet = {
        meta: Array.from(metaSet.values()),
        data: Array.from(tsBucketMap.values())
      };
      return isRatio ? computeResultSetRatio(_resultSet) : _resultSet;
    }
    throw new Error("No result sets");
  }
}
const testLocalConnection = async ({
  host,
  username,
  password
}) => {
  try {
    const client = new ClickhouseClient({ host, username, password });
    const result = await client.query({
      query: "SELECT 1",
      format: "TabSeparatedRaw"
    });
    return result.text().then((text) => text.trim() === "1");
  } catch (e) {
    console.warn("Failed to test local connection", e);
    return false;
  }
};
const tableExpr = ({
  database,
  table
}) => {
  return chSql`${{ Identifier: database }}.${{ Identifier: table }}`;
};
function parameterizedQueryToSql({
  sql,
  params
}) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{${key}:\\w+}`, "g"), value);
  }, sql);
}
function chSqlToAliasMap(chSql2) {
  const aliasMap = {};
  if (chSql2 == null) {
    return aliasMap;
  }
  try {
    const sql = parameterizedQueryToSql(chSql2);
    const parser = new SQLParser.Parser();
    const ast = parser.astify(sql, {
      database: "Postgresql",
      parseOptions: { includeLocations: true }
    });
    if (ast.columns != null) {
      ast.columns.forEach((column) => {
        if (column.as != null) {
          if (column.type === "expr" && column.expr.type === "column_ref") {
            aliasMap[column.as] = column.expr.array_index && column.expr.array_index[0]?.brackets ? (
              // alias with brackets, ex: ResourceAttributes['service.name'] as service_name
              `${column.expr.column.expr.value}['${column.expr.array_index[0].index.value}']`
            ) : (
              // normal alias
              column.expr.column.expr.value
            );
          } else if (column.expr.loc != null) {
            aliasMap[column.as] = sql.slice(
              column.expr.loc.start.offset,
              column.expr.loc.end.offset
            );
          } else {
            console.error("Unknown alias column type", column);
          }
        }
      });
    }
  } catch (e) {
    console.error("Error parsing alias map", e, "for query", chSql2);
  }
  return aliasMap;
}
function filterColumnMetaByType(meta, types) {
  return meta.filter(
    (column) => types.includes(convertCHDataTypeToJSType(column.type))
  );
}
function inferTimestampColumn(meta) {
  return filterColumnMetaByType(meta, ["date" /* Date */])?.[0];
}
function inferNumericColumn(meta) {
  return filterColumnMetaByType(meta, ["number" /* Number */]);
}
export {
  ClickHouseQueryError,
  ClickhouseClient,
  JSDataType,
  chSql,
  chSqlToAliasMap,
  computeRatio,
  computeResultSetRatio,
  concatChSql,
  convertCHDataTypeToJSType,
  convertCHTypeToPrimitiveJSType,
  extractColumnReference,
  filterColumnMetaByType,
  getResponseHeaders,
  inferNumericColumn,
  inferTimestampColumn,
  parameterizedQueryToSql,
  tableExpr,
  testLocalConnection,
  wrapChSqlIfNotEmpty
};
