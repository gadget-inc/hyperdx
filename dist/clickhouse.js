"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } function _optionalChainDelete(ops) { const result = _optionalChain(ops); return result == null ? true : result; }var _nodesqlparser = require('node-sql-parser'); var SQLParser = _interopRequireWildcard(_nodesqlparser);
var _objecthash = require('object-hash'); var _objecthash2 = _interopRequireDefault(_objecthash);




var _renderChartConfig = require('@/renderChartConfig');
var _utils = require('@/utils');
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
const hash = (input) => Math.abs(_utils.hashCode.call(void 0, `${input}`));
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
  const timestampColumn = inferTimestampColumn(_nullishCoalesce(_meta, () => ( [])));
  const _restColumns = _optionalChain([_meta, 'optionalAccess', _ => _.filter, 'call', _2 => _2((m) => m.name !== _optionalChain([timestampColumn, 'optionalAccess', _3 => _3.name]))]);
  const firstColumn = _optionalChain([_restColumns, 'optionalAccess', _4 => _4[0]]);
  const secondColumn = _optionalChain([_restColumns, 'optionalAccess', _5 => _5[1]]);
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
  const auth = _optionalChain([init, 'access', _6 => _6.headers, 'optionalAccess', _7 => _7["Authorization"]]);
  const [username, password] = window.atob(auth.substring("Bearer".length)).split(":");
   _optionalChainDelete([init, 'access', _8 => _8.headers, 'optionalAccess', _9 => delete _9["Authorization"]]);
  if (username) url.searchParams.set("user", username);
  if (password) url.searchParams.set("password", password);
  return fetch(`${url.toString()}`, init);
};
const standardModeFetch = (input, init) => {
  if (!init) init = {};
   _optionalChainDelete([init, 'access', _10 => _10.headers, 'optionalAccess', _11 => delete _11["Authorization"]]);
  return fetch(input, init);
};
class ClickhouseClient {
  
  
  
  /*
   * Some clickhouse db's (the demo instance for example) make the
   * max_rows_to_read setting readonly and the query will fail if you try to
   * query with max_rows_to_read specified
   */
  
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
    if (_optionalChain([clickhouse_settings, 'optionalAccess', _12 => _12.max_rows_to_read]) && this.maxRowReadOnly) {
      delete clickhouse_settings["max_rows_to_read"];
    }
    if (_utils.isBrowser) {
      const { createClient } = await Promise.resolve().then(() => _interopRequireWildcard(require("@clickhouse/client-web")));
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
        username: _nullishCoalesce(this.username, () => ( "")),
        password: _nullishCoalesce(this.password, () => ( "")),
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
    } else if (_utils.isNode) {
      const { createClient } = await Promise.resolve().then(() => _interopRequireWildcard(require("@clickhouse/client")));
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
    config = _renderChartConfig.setChartSelectsAlias.call(void 0, config);
    const queries = await Promise.all(
      _renderChartConfig.splitChartConfigs.call(void 0, config).map((c) => _renderChartConfig.renderChartConfig.call(void 0, c, metadata))
    );
    const isTimeSeries = config.displayType === "line";
    const resultSets = await Promise.all(
      queries.map(async (query) => {
        const resp = await this.query({
          query: query.sql,
          query_params: query.params,
          format: "JSON",
          abort_signal: _optionalChain([opts, 'optionalAccess', _13 => _13.abort_signal]),
          connectionId: config.connection,
          clickhouse_settings: _optionalChain([opts, 'optionalAccess', _14 => _14.clickhouse_settings])
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
        const timestampColumn = inferTimestampColumn(_nullishCoalesce(resultSet.meta, () => ( [])));
        const numericColumn = inferNumericColumn(_nullishCoalesce(resultSet.meta, () => ( [])));
        const numericColumnName = _optionalChain([numericColumn, 'optionalAccess', _15 => _15[0], 'optionalAccess', _16 => _16.name]);
        for (const row of resultSet.data) {
          const _rowWithoutValue = numericColumnName ? Object.fromEntries(
            Object.entries(row).filter(
              ([key]) => key !== numericColumnName
            )
          ) : { ...row };
          const ts = timestampColumn != null ? row[timestampColumn.name] : isTimeSeries ? _objecthash2.default.call(void 0, _rowWithoutValue) : "__FIXED_TIMESTAMP__";
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
            aliasMap[column.as] = column.expr.array_index && _optionalChain([column, 'access', _17 => _17.expr, 'access', _18 => _18.array_index, 'access', _19 => _19[0], 'optionalAccess', _20 => _20.brackets]) ? (
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
  return _optionalChain([filterColumnMetaByType, 'call', _21 => _21(meta, ["date" /* Date */]), 'optionalAccess', _22 => _22[0]]);
}
function inferNumericColumn(meta) {
  return filterColumnMetaByType(meta, ["number" /* Number */]);
}




















exports.ClickHouseQueryError = ClickHouseQueryError; exports.ClickhouseClient = ClickhouseClient; exports.JSDataType = JSDataType; exports.chSql = chSql; exports.chSqlToAliasMap = chSqlToAliasMap; exports.computeRatio = computeRatio; exports.computeResultSetRatio = computeResultSetRatio; exports.concatChSql = concatChSql; exports.convertCHDataTypeToJSType = convertCHDataTypeToJSType; exports.convertCHTypeToPrimitiveJSType = convertCHTypeToPrimitiveJSType; exports.extractColumnReference = extractColumnReference; exports.filterColumnMetaByType = filterColumnMetaByType; exports.getResponseHeaders = getResponseHeaders; exports.inferNumericColumn = inferNumericColumn; exports.inferTimestampColumn = inferTimestampColumn; exports.parameterizedQueryToSql = parameterizedQueryToSql; exports.tableExpr = tableExpr; exports.testLocalConnection = testLocalConnection; exports.wrapChSqlIfNotEmpty = wrapChSqlIfNotEmpty;
