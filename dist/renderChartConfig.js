"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _isPlainObject = require('lodash/isPlainObject'); var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
var _nodesqlparser = require('node-sql-parser'); var SQLParser = _interopRequireWildcard(_nodesqlparser);
var _clickhouse = require('@/clickhouse');
var _queryParser = require('@/queryParser');




var _types = require('@/types');




var _utils = require('@/utils');
function determineTableName(select) {
  if ("metricTables" in select.from) {
    return select.from.tableName;
  }
  return "";
}
const DEFAULT_METRIC_TABLE_TIME_COLUMN = "TimeUnix";
const FIXED_TIME_BUCKET_EXPR_ALIAS = "__hdx_time_bucket";
function isUsingGroupBy(chartConfig) {
  return chartConfig.groupBy != null && chartConfig.groupBy.length > 0;
}
function isUsingGranularity(chartConfig) {
  return chartConfig.timestampValueExpression != null && chartConfig.granularity != null;
}
const isMetricChartConfig = (chartConfig) => {
  return chartConfig.metricTables != null;
};
const setChartSelectsAlias = (config) => {
  if (Array.isArray(config.select) && isMetricChartConfig(config)) {
    return {
      ...config,
      select: config.select.map((s) => ({
        ...s,
        alias: _nullishCoalesce(s.alias, () => ( `${s.aggFn}(${s.metricName})`))
        // use an alias if one isn't already set
      }))
    };
  }
  return config;
};
const splitChartConfigs = (config) => {
  if (isMetricChartConfig(config) && Array.isArray(config.select)) {
    const _configs = [];
    for (const select of config.select) {
      _configs.push({
        ...config,
        select: [select]
      });
    }
    return _configs;
  }
  return [config];
};
const INVERSE_OPERATOR_MAP = {
  "=": "!=",
  ">": "<=",
  "<": ">=",
  "!=": "=",
  "<=": ">",
  ">=": "<"
};
function inverseSqlAstFilter(filter) {
  return {
    ...filter,
    operator: INVERSE_OPERATOR_MAP[filter.operator]
  };
}
function isNonEmptyWhereExpr(where) {
  return where != null && where.trim() != "";
}
const fastifySQL = ({
  materializedFields,
  rawSQL
}) => {
  try {
    const parser = new SQLParser.Parser();
    const ast = parser.astify(rawSQL, {
      database: "Postgresql"
    });
    const traverse = (node) => {
      if (node == null) {
        return;
      }
      let colExpr;
      switch (node.type) {
        case "column_ref": {
          const _n = node;
          if (typeof _n.column !== "string") {
            colExpr = `${_optionalChain([_n, 'access', _ => _.column, 'optionalAccess', _2 => _2.expr, 'access', _3 => _3.value])}['${_optionalChain([_n, 'access', _4 => _4.array_index, 'optionalAccess', _5 => _5[0], 'optionalAccess', _6 => _6.index, 'access', _7 => _7.value])}']`;
          }
          break;
        }
        case "binary_expr": {
          const _n = node;
          if (Array.isArray(_n.left)) {
            for (const left of _n.left) {
              traverse(left);
            }
          } else {
            traverse(_n.left);
          }
          if (Array.isArray(_n.right)) {
            for (const right of _n.right) {
              traverse(right);
            }
          } else {
            traverse(_n.right);
          }
          break;
        }
        case "function": {
          const _n = node;
          if (_optionalChain([_n, 'access', _8 => _8.args, 'optionalAccess', _9 => _9.type]) === "expr_list") {
            if (Array.isArray(_optionalChain([_n, 'access', _10 => _10.args, 'optionalAccess', _11 => _11.value]))) {
              for (const arg of _n.args.value) {
                traverse(arg);
              }
              if (_optionalChain([_n, 'access', _12 => _12.args, 'optionalAccess', _13 => _13.value, 'optionalAccess', _14 => _14[0], 'optionalAccess', _15 => _15.type]) === "column_ref" && _optionalChain([_n, 'access', _16 => _16.args, 'optionalAccess', _17 => _17.value, 'optionalAccess', _18 => _18[1], 'optionalAccess', _19 => _19.type]) === "single_quote_string") {
                colExpr = `${_optionalChain([_n, 'access', _20 => _20.name, 'optionalAccess', _21 => _21.name, 'optionalAccess', _22 => _22[0], 'optionalAccess', _23 => _23.value])}(${_optionalChain([_n, 'access', _24 => _24.args, 'optionalAccess', _25 => _25.value, 'optionalAccess', _26 => _26[0], 'optionalAccess', _27 => _27.column, 'access', _28 => _28.expr, 'access', _29 => _29.value])}, '${_optionalChain([_n, 'access', _30 => _30.args, 'optionalAccess', _31 => _31.value, 'optionalAccess', _32 => _32[1], 'optionalAccess', _33 => _33.value])}')`;
              }
            } else if (_isPlainObject2.default.call(void 0, _optionalChain([_n, 'access', _34 => _34.args, 'optionalAccess', _35 => _35.value]))) {
              traverse(_n.args.value);
            }
          }
          break;
        }
        default:
          break;
      }
      if (colExpr) {
        const materializedField = materializedFields.get(colExpr);
        if (materializedField) {
          const _n = node;
          for (const key in _n) {
            if (_n.hasOwnProperty(key)) {
              delete _n[key];
            }
          }
          _n.type = "column_ref";
          _n.table = null;
          _n.column = { expr: { type: "default", value: materializedField } };
        }
      }
    };
    if (Array.isArray(ast.columns)) {
      for (const col of ast.columns) {
        traverse(col.expr);
      }
    }
    traverse(ast.where);
    return parser.sqlify(ast);
  } catch (e) {
    return rawSQL;
  }
};
const aggFnExpr = ({
  fn,
  expr,
  quantileLevel,
  where
}) => {
  const isCount = fn.startsWith("count");
  const isWhereUsed = isNonEmptyWhereExpr(where);
  const unsafeExpr = {
    UNSAFE_RAW_SQL: `toFloat64OrDefault(toString(${expr}))`
  };
  const whereWithExtraNullCheck = `${where} AND ${unsafeExpr.UNSAFE_RAW_SQL} IS NOT NULL`;
  if (fn.endsWith("Merge")) {
    return _clickhouse.chSql`${fn}(${{
      UNSAFE_RAW_SQL: _nullishCoalesce(expr, () => ( ""))
    }})`;
  } else if (fn.endsWith("State")) {
    if (expr == null || isCount) {
      return isWhereUsed ? _clickhouse.chSql`${fn}(${{ UNSAFE_RAW_SQL: where }})` : _clickhouse.chSql`${fn}()`;
    }
    return _clickhouse.chSql`${fn}(${unsafeExpr}${isWhereUsed ? _clickhouse.chSql`, ${{ UNSAFE_RAW_SQL: whereWithExtraNullCheck }}` : ""})`;
  }
  if (fn === "count") {
    if (isWhereUsed) {
      return _clickhouse.chSql`${fn}If(${{ UNSAFE_RAW_SQL: where }})`;
    }
    return {
      sql: `${fn}()`,
      params: {}
    };
  }
  if (expr != null) {
    if (fn === "count_distinct") {
      return _clickhouse.chSql`count${isWhereUsed ? "If" : ""}(DISTINCT ${{
        UNSAFE_RAW_SQL: expr
      }}${isWhereUsed ? _clickhouse.chSql`, ${{ UNSAFE_RAW_SQL: where }}` : ""})`;
    }
    if (quantileLevel != null) {
      return _clickhouse.chSql`quantile${isWhereUsed ? "If" : ""}(${{
        // Using Float64 param leads to an added coersion, but we don't need to
        // escape number values anyways
        UNSAFE_RAW_SQL: Number.isFinite(quantileLevel) ? `${quantileLevel}` : "0"
      }})(${unsafeExpr}${isWhereUsed ? _clickhouse.chSql`, ${{ UNSAFE_RAW_SQL: whereWithExtraNullCheck }}` : ""})`;
    }
    return _clickhouse.chSql`${{ UNSAFE_RAW_SQL: fn }}${isWhereUsed ? "If" : ""}(
      ${unsafeExpr}${isWhereUsed ? _clickhouse.chSql`, ${{ UNSAFE_RAW_SQL: whereWithExtraNullCheck }}` : ""}
    )`;
  } else {
    throw new Error(
      "Column is required for all non-count aggregation functions"
    );
  }
};
async function renderSelectList(selectList, chartConfig, metadata) {
  if (typeof selectList === "string") {
    return _clickhouse.chSql`${{ UNSAFE_RAW_SQL: selectList }}`;
  }
  const materializedFields = _optionalChain([chartConfig, 'access', _36 => _36.with, 'optionalAccess', _37 => _37.length]) ? void 0 : await metadata.getMaterializedColumnsLookupTable({
    connectionId: chartConfig.connection,
    databaseName: chartConfig.from.databaseName,
    tableName: chartConfig.from.tableName
  });
  const isRatio = chartConfig.seriesReturnType === "ratio" && selectList.length === 2;
  const selectsSQL = await Promise.all(
    selectList.map(async (select) => {
      const whereClause = await renderWhereExpression({
        condition: _nullishCoalesce(select.aggCondition, () => ( "")),
        from: chartConfig.from,
        language: _nullishCoalesce(select.aggConditionLanguage, () => ( "lucene")),
        implicitColumnExpression: chartConfig.implicitColumnExpression,
        fallbackAttributeExpression: chartConfig.fallbackAttributeExpression,
        columnAliases: chartConfig.columnAliases,
        metadata,
        connectionId: chartConfig.connection,
        with: chartConfig.with
      });
      let expr;
      if (select.aggFn == null) {
        expr = _clickhouse.chSql`${{ UNSAFE_RAW_SQL: select.valueExpression }}`;
      } else if (select.aggFn === "quantile") {
        expr = aggFnExpr({
          fn: select.aggFn,
          expr: select.valueExpression,
          // @ts-ignore (TS doesn't know that we've already checked for quantile)
          quantileLevel: select.level,
          where: whereClause.sql
        });
      } else {
        expr = aggFnExpr({
          fn: select.aggFn,
          expr: select.valueExpression,
          where: whereClause.sql
        });
      }
      const rawSQL = `SELECT ${expr.sql} FROM \`t\``;
      if (materializedFields) {
        expr.sql = fastifySQL({ materializedFields, rawSQL }).replace(/^SELECT\s+/i, "").replace(/\s+FROM `t`$/i, "");
      }
      return _clickhouse.chSql`${expr}${select.alias != null ? _clickhouse.chSql` AS "${{ UNSAFE_RAW_SQL: select.alias }}"` : []}`;
    })
  );
  return isRatio ? [_clickhouse.chSql`divide(${selectsSQL[0]}, ${selectsSQL[1]})`] : selectsSQL;
}
function renderSortSpecificationList(sortSpecificationList) {
  if (typeof sortSpecificationList === "string") {
    return _clickhouse.chSql`${{ UNSAFE_RAW_SQL: sortSpecificationList }}`;
  }
  return sortSpecificationList.map((sortSpecification) => {
    return _clickhouse.chSql`${{ UNSAFE_RAW_SQL: sortSpecification.valueExpression }} ${sortSpecification.ordering === "DESC" ? "DESC" : "ASC"}`;
  });
}
function timeBucketExpr({
  interval,
  timestampValueExpression,
  dateRange,
  alias = FIXED_TIME_BUCKET_EXPR_ALIAS
}) {
  const unsafeTimestampValueExpression = {
    UNSAFE_RAW_SQL: _utils.getFirstTimestampValueExpression.call(void 0, timestampValueExpression)
  };
  const unsafeInterval = {
    UNSAFE_RAW_SQL: interval === "auto" && Array.isArray(dateRange) ? _utils.convertDateRangeToGranularityString.call(void 0, dateRange, 60) : interval
  };
  return _clickhouse.chSql`toStartOfInterval(toDateTime(${unsafeTimestampValueExpression}), INTERVAL ${unsafeInterval}) AS \`${{
    UNSAFE_RAW_SQL: alias
  }}\``;
}
async function timeFilterExpr({
  connectionId,
  databaseName,
  dateRange,
  dateRangeEndInclusive,
  dateRangeStartInclusive,
  includedDataInterval,
  metadata,
  tableName,
  timestampValueExpression,
  with: withClauses
}) {
  const valueExpressions = _utils.splitAndTrimWithBracket.call(void 0, timestampValueExpression);
  const startTime = dateRange[0].getTime();
  const endTime = dateRange[1].getTime();
  const whereExprs = await Promise.all(
    valueExpressions.map(async (expr) => {
      const col = expr.trim();
      const columnMeta = _optionalChain([withClauses, 'optionalAccess', _38 => _38.length]) ? null : await metadata.getColumn({
        databaseName,
        tableName,
        column: col,
        connectionId
      });
      const unsafeTimestampValueExpression = {
        UNSAFE_RAW_SQL: col
      };
      if (columnMeta == null && !_optionalChain([withClauses, 'optionalAccess', _39 => _39.length])) {
        console.warn(
          `Column ${col} not found in ${databaseName}.${tableName} while inferring type for time filter`
        );
      }
      const startTimeCond = includedDataInterval ? _clickhouse.chSql`toStartOfInterval(fromUnixTimestamp64Milli(${{ Int64: startTime }}), INTERVAL ${includedDataInterval}) - INTERVAL ${includedDataInterval}` : _clickhouse.chSql`fromUnixTimestamp64Milli(${{ Int64: startTime }})`;
      const endTimeCond = includedDataInterval ? _clickhouse.chSql`toStartOfInterval(fromUnixTimestamp64Milli(${{ Int64: endTime }}), INTERVAL ${includedDataInterval}) + INTERVAL ${includedDataInterval}` : _clickhouse.chSql`fromUnixTimestamp64Milli(${{ Int64: endTime }})`;
      if (_optionalChain([columnMeta, 'optionalAccess', _40 => _40.type]) === "Date") {
        return _clickhouse.chSql`(${unsafeTimestampValueExpression} ${dateRangeStartInclusive ? ">=" : ">"} toDate(${startTimeCond}) AND ${unsafeTimestampValueExpression} ${dateRangeEndInclusive ? "<=" : "<"} toDate(${endTimeCond}))`;
      } else {
        return _clickhouse.chSql`(${unsafeTimestampValueExpression} ${dateRangeStartInclusive ? ">=" : ">"} ${startTimeCond} AND ${unsafeTimestampValueExpression} ${dateRangeEndInclusive ? "<=" : "<"} ${endTimeCond})`;
      }
    })
  );
  return _clickhouse.concatChSql.call(void 0, "AND", ...whereExprs);
}
async function renderSelect(chartConfig, metadata) {
  const isIncludingTimeBucket = isUsingGranularity(chartConfig);
  const isIncludingGroupBy = isUsingGroupBy(chartConfig);
  return _clickhouse.concatChSql.call(void 0, 
    ",",
    await renderSelectList(chartConfig.select, chartConfig, metadata),
    isIncludingGroupBy && chartConfig.selectGroupBy !== false ? await renderSelectList(chartConfig.groupBy, chartConfig, metadata) : [],
    isIncludingTimeBucket ? timeBucketExpr({
      interval: chartConfig.granularity,
      timestampValueExpression: chartConfig.timestampValueExpression,
      dateRange: chartConfig.dateRange
    }) : []
  );
}
function renderFrom({
  from
}) {
  return _clickhouse.concatChSql.call(void 0, 
    ".",
    _clickhouse.chSql`${from.databaseName === "" ? "" : { Identifier: from.databaseName }}`,
    _clickhouse.chSql`${{
      Identifier: from.tableName
    }}`
  );
}
async function renderWhereExpression({
  condition,
  language,
  metadata,
  from,
  implicitColumnExpression,
  fallbackAttributeExpression,
  columnAliases,
  connectionId,
  with: withClauses
}) {
  let _condition = condition;
  if (language === "lucene") {
    const serializer = new (0, _queryParser.CustomSchemaSQLSerializerV2)({
      metadata,
      databaseName: from.databaseName,
      tableName: from.tableName,
      implicitColumnExpression,
      fallbackAttributeExpression,
      columnAliases,
      connectionId
    });
    const builder = new (0, _queryParser.SearchQueryBuilder)(condition, serializer);
    _condition = await builder.build();
  }
  const materializedFields = _optionalChain([withClauses, 'optionalAccess', _41 => _41.length]) ? void 0 : await metadata.getMaterializedColumnsLookupTable({
    connectionId,
    databaseName: from.databaseName,
    tableName: from.tableName
  });
  const _sqlPrefix = "SELECT * FROM `t` WHERE ";
  const rawSQL = `${_sqlPrefix}${_condition}`;
  if (materializedFields) {
    _condition = fastifySQL({ materializedFields, rawSQL }).replace(
      _sqlPrefix,
      ""
    );
  }
  return _clickhouse.chSql`${{ UNSAFE_RAW_SQL: _condition }}`;
}
async function renderWhere(chartConfig, metadata) {
  let whereSearchCondition = [];
  if (isNonEmptyWhereExpr(chartConfig.where)) {
    whereSearchCondition = _clickhouse.wrapChSqlIfNotEmpty.call(void 0, 
      await renderWhereExpression({
        condition: chartConfig.where,
        from: chartConfig.from,
        language: _nullishCoalesce(chartConfig.whereLanguage, () => ( "sql")),
        implicitColumnExpression: chartConfig.implicitColumnExpression,
        fallbackAttributeExpression: chartConfig.fallbackAttributeExpression,
        columnAliases: chartConfig.columnAliases,
        metadata,
        connectionId: chartConfig.connection,
        with: chartConfig.with
      }),
      "(",
      ")"
    );
  }
  let selectSearchConditions = [];
  if (typeof chartConfig.select != "string" && // Only if every select has an aggCondition, add to where clause
  // otherwise we'll scan all rows anyways
  chartConfig.select.every((select) => isNonEmptyWhereExpr(select.aggCondition))) {
    selectSearchConditions = (await Promise.all(
      chartConfig.select.map(async (select) => {
        if (isNonEmptyWhereExpr(select.aggCondition)) {
          return await renderWhereExpression({
            condition: select.aggCondition,
            from: chartConfig.from,
            language: _nullishCoalesce(select.aggConditionLanguage, () => ( "sql")),
            implicitColumnExpression: chartConfig.implicitColumnExpression,
            fallbackAttributeExpression: chartConfig.fallbackAttributeExpression,
            columnAliases: chartConfig.columnAliases,
            metadata,
            connectionId: chartConfig.connection,
            with: chartConfig.with
          });
        }
        return null;
      })
    )).filter((v) => v !== null);
  }
  const filterConditions = await Promise.all(
    (_nullishCoalesce(chartConfig.filters, () => ( []))).map(async (filter) => {
      if (filter.type === "sql_ast") {
        return _clickhouse.wrapChSqlIfNotEmpty.call(void 0, 
          _clickhouse.chSql`${{ UNSAFE_RAW_SQL: filter.left }} ${filter.operator} ${{ UNSAFE_RAW_SQL: filter.right }}`,
          "(",
          ")"
        );
      } else if (filter.type === "lucene" || filter.type === "sql") {
        return _clickhouse.wrapChSqlIfNotEmpty.call(void 0, 
          await renderWhereExpression({
            condition: filter.condition,
            from: chartConfig.from,
            language: filter.type,
            implicitColumnExpression: chartConfig.implicitColumnExpression,
            fallbackAttributeExpression: chartConfig.fallbackAttributeExpression,
            columnAliases: chartConfig.columnAliases,
            metadata,
            connectionId: chartConfig.connection,
            with: chartConfig.with
          }),
          "(",
          ")"
        );
      }
      throw new Error(`Unknown filter type: ${filter.type}`);
    })
  );
  return _clickhouse.concatChSql.call(void 0, 
    " AND ",
    chartConfig.dateRange != null && chartConfig.timestampValueExpression != null ? await timeFilterExpr({
      timestampValueExpression: chartConfig.timestampValueExpression,
      dateRange: chartConfig.dateRange,
      dateRangeStartInclusive: _nullishCoalesce(chartConfig.dateRangeStartInclusive, () => ( true)),
      dateRangeEndInclusive: _nullishCoalesce(chartConfig.dateRangeEndInclusive, () => ( true)),
      metadata,
      connectionId: chartConfig.connection,
      databaseName: chartConfig.from.databaseName,
      tableName: chartConfig.from.tableName,
      with: chartConfig.with,
      includedDataInterval: chartConfig.includedDataInterval
    }) : [],
    whereSearchCondition,
    // Add aggConditions to where clause to utilize index
    _clickhouse.wrapChSqlIfNotEmpty.call(void 0, _clickhouse.concatChSql.call(void 0, " OR ", selectSearchConditions), "(", ")"),
    _clickhouse.wrapChSqlIfNotEmpty.call(void 0, 
      _clickhouse.concatChSql.call(void 0, 
        chartConfig.filtersLogicalOperator === "OR" ? " OR " : " AND ",
        ...filterConditions
      ),
      "(",
      ")"
    )
  );
}
async function renderGroupBy(chartConfig, metadata) {
  return _clickhouse.concatChSql.call(void 0, 
    ",",
    isUsingGroupBy(chartConfig) ? await renderSelectList(chartConfig.groupBy, chartConfig, metadata) : [],
    isUsingGranularity(chartConfig) ? timeBucketExpr({
      interval: chartConfig.granularity,
      timestampValueExpression: chartConfig.timestampValueExpression,
      dateRange: chartConfig.dateRange
    }) : []
  );
}
function renderOrderBy(chartConfig) {
  const isIncludingTimeBucket = isUsingGranularity(chartConfig);
  if (chartConfig.orderBy == null && !isIncludingTimeBucket) {
    return void 0;
  }
  return _clickhouse.concatChSql.call(void 0, 
    ",",
    isIncludingTimeBucket ? timeBucketExpr({
      interval: chartConfig.granularity,
      timestampValueExpression: chartConfig.timestampValueExpression,
      dateRange: chartConfig.dateRange
    }) : [],
    chartConfig.orderBy != null ? renderSortSpecificationList(chartConfig.orderBy) : []
  );
}
function renderLimit(chartConfig) {
  if (chartConfig.limit == null || chartConfig.limit.limit == null) {
    return void 0;
  }
  const offset = chartConfig.limit.offset != null ? _clickhouse.chSql` OFFSET ${{ Int32: chartConfig.limit.offset }}` : [];
  return _clickhouse.chSql`${{ Int32: chartConfig.limit.limit }}${offset}`;
}
async function renderWith(chartConfig, metadata) {
  const { with: withClauses } = chartConfig;
  if (withClauses) {
    return _clickhouse.concatChSql.call(void 0, 
      ",",
      await Promise.all(
        withClauses.map(async (clause) => {
          const {
            sql,
            chartConfig: chartConfig2
          } = clause;
          if (sql && chartConfig2) {
            throw new Error(
              "cannot specify both 'sql' and 'chartConfig' in with clause"
            );
          }
          if (!(sql || chartConfig2)) {
            throw new Error(
              "must specify either 'sql' or 'chartConfig' in with clause"
            );
          }
          if (sql && !_types.ChSqlSchema.safeParse(sql).success) {
            throw new Error("non-conforming sql object in CTE");
          }
          if (chartConfig2 && !_types.ChartConfigSchema.safeParse(chartConfig2).success) {
            throw new Error("non-conforming chartConfig object in CTE");
          }
          const resolvedSql = sql ? sql : await renderChartConfig(chartConfig2, metadata);
          if (clause.isSubquery === false) {
            return _clickhouse.chSql`(${resolvedSql}) AS ${{ Identifier: clause.name }}`;
          }
          return _clickhouse.chSql`${clause.name} AS (${resolvedSql})`;
        })
      )
    );
  }
  return void 0;
}
function intervalToSeconds(interval) {
  const [amount, unit] = interval.split(" ");
  const value = parseInt(amount, 10);
  switch (unit) {
    case "second":
      return value;
    case "minute":
      return value * 60;
    case "hour":
      return value * 60 * 60;
    case "day":
      return value * 24 * 60 * 60;
    default:
      throw new Error(`Invalid interval unit ${unit} in interval ${interval}`);
  }
}
function renderFill(chartConfig) {
  const { granularity, dateRange } = chartConfig;
  if (dateRange && granularity && granularity !== "auto") {
    const [start, end] = dateRange;
    const step = intervalToSeconds(granularity);
    return _clickhouse.concatChSql.call(void 0, " ", [
      _clickhouse.chSql`FROM toUnixTimestamp(toStartOfInterval(fromUnixTimestamp64Milli(${{ Int64: start.getTime() }}), INTERVAL ${granularity}))
      TO toUnixTimestamp(toStartOfInterval(fromUnixTimestamp64Milli(${{ Int64: end.getTime() }}), INTERVAL ${granularity}))
      STEP ${{ Int32: step }}`
    ]);
  }
  return void 0;
}
async function translateMetricChartConfig(chartConfig, metadata) {
  const metricTables = chartConfig.metricTables;
  if (!metricTables) {
    return chartConfig;
  }
  const { select, from, filters, where, ...restChartConfig } = chartConfig;
  if (!select || !Array.isArray(select)) {
    throw new Error("multi select or string select on metrics not supported");
  }
  const { metricType, metricName, ..._select } = select[0];
  if (metricType === _types.MetricsDataType.Gauge && metricName) {
    const timeBucketCol = "__hdx_time_bucket2";
    const timeExpr = timeBucketExpr({
      interval: chartConfig.granularity || "auto",
      timestampValueExpression: chartConfig.timestampValueExpression || DEFAULT_METRIC_TABLE_TIME_COLUMN,
      dateRange: chartConfig.dateRange,
      alias: timeBucketCol
    });
    const where2 = await renderWhere(
      {
        ...chartConfig,
        from: {
          ...from,
          tableName: metricTables[_types.MetricsDataType.Gauge]
        },
        filters: [
          ..._nullishCoalesce(filters, () => ( [])),
          {
            type: "sql",
            condition: `MetricName = '${metricName}'`
          }
        ]
      },
      metadata
    );
    return {
      ...restChartConfig,
      with: [
        {
          name: "Source",
          sql: _clickhouse.chSql`
            SELECT
              *,
              cityHash64(mapConcat(ScopeAttributes, ResourceAttributes, Attributes)) AS AttributesHash
            FROM ${renderFrom({ from: { ...from, tableName: metricTables[_types.MetricsDataType.Gauge] } })}
            WHERE ${where2}
          `
        },
        {
          name: "Bucketed",
          sql: _clickhouse.chSql`
            SELECT
              ${timeExpr},
              AttributesHash,
              last_value(Value) AS LastValue,
              any(ScopeAttributes) AS ScopeAttributes,
              any(ResourceAttributes) AS ResourceAttributes,
              any(Attributes) AS Attributes,
              any(ResourceSchemaUrl) AS ResourceSchemaUrl,
              any(ScopeName) AS ScopeName,
              any(ScopeVersion) AS ScopeVersion,
              any(ScopeDroppedAttrCount) AS ScopeDroppedAttrCount,
              any(ScopeSchemaUrl) AS ScopeSchemaUrl,
              any(ServiceName) AS ServiceName,
              any(MetricDescription) AS MetricDescription,
              any(MetricUnit) AS MetricUnit,
              any(StartTimeUnix) AS StartTimeUnix,
              any(Flags) AS Flags
            FROM Source
            GROUP BY AttributesHash, ${timeBucketCol}
            ORDER BY AttributesHash, ${timeBucketCol}
          `
        }
      ],
      select: [
        {
          ..._select,
          valueExpression: "LastValue",
          aggCondition: ""
          // clear up the condition since the where clause is already applied at the upstream CTE
        }
      ],
      from: {
        databaseName: "",
        tableName: "Bucketed"
      },
      where: "",
      // clear up the condition since the where clause is already applied at the upstream CTE
      timestampValueExpression: timeBucketCol
    };
  } else if (metricType === _types.MetricsDataType.Sum && metricName) {
    const timeBucketCol = "__hdx_time_bucket2";
    const valueHighCol = "`__hdx_value_high`";
    const valueHighPrevCol = "`__hdx_value_high_prev`";
    const timeExpr = timeBucketExpr({
      interval: chartConfig.granularity || "auto",
      timestampValueExpression: chartConfig.timestampValueExpression || "TimeUnix",
      dateRange: chartConfig.dateRange,
      alias: timeBucketCol
    });
    const where2 = await renderWhere(
      {
        ...chartConfig,
        from: {
          ...from,
          tableName: metricTables[_types.MetricsDataType.Sum]
        },
        filters: [
          ..._nullishCoalesce(filters, () => ( [])),
          {
            type: "sql",
            condition: `MetricName = '${metricName}'`
          }
        ],
        includedDataInterval: chartConfig.granularity === "auto" && Array.isArray(chartConfig.dateRange) ? _utils.convertDateRangeToGranularityString.call(void 0, chartConfig.dateRange, 60) : chartConfig.granularity
      },
      metadata
    );
    return {
      ...restChartConfig,
      with: [
        {
          name: "Source",
          sql: _clickhouse.chSql`
                SELECT
                  *,
                  cityHash64(mapConcat(ScopeAttributes, ResourceAttributes, Attributes)) AS AttributesHash,
                  IF(AggregationTemporality = 1,
                    SUM(Value) OVER (PARTITION BY AttributesHash ORDER BY AttributesHash, TimeUnix ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
                    deltaSum(Value) OVER (PARTITION BY AttributesHash ORDER BY AttributesHash, TimeUnix ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
                  ) AS Rate,
                  IF(AggregationTemporality = 1, Rate, Value) AS Sum
                FROM ${renderFrom({ from: { ...from, tableName: metricTables[_types.MetricsDataType.Sum] } })}
                WHERE ${where2}`
        },
        {
          name: "Bucketed",
          sql: _clickhouse.chSql`
            SELECT
              ${timeExpr},
              AttributesHash,
              last_value(Source.Rate) AS ${valueHighCol},
              any(${valueHighCol}) OVER(PARTITION BY AttributesHash ORDER BY \`${timeBucketCol}\` ROWS BETWEEN 1 PRECEDING AND 1 PRECEDING) AS ${valueHighPrevCol},
              ${valueHighCol} - ${valueHighPrevCol} AS Rate,
              last_value(Source.Sum) AS Sum,
              any(ResourceAttributes) AS ResourceAttributes,
              any(ResourceSchemaUrl) AS ResourceSchemaUrl,
              any(ScopeName) AS ScopeName,
              any(ScopeVersion) AS ScopeVersion,
              any(ScopeAttributes) AS ScopeAttributes,
              any(ScopeDroppedAttrCount) AS ScopeDroppedAttrCount,
              any(ScopeSchemaUrl) AS ScopeSchemaUrl,
              any(ServiceName) AS ServiceName,
              any(MetricName) AS MetricName,
              any(MetricDescription) AS MetricDescription,
              any(MetricUnit) AS MetricUnit,
              any(Attributes) AS Attributes,
              any(StartTimeUnix) AS StartTimeUnix,
              any(Flags) AS Flags,
              any(AggregationTemporality) AS AggregationTemporality,
              any(IsMonotonic) AS IsMonotonic
            FROM Source
            GROUP BY AttributesHash, \`${timeBucketCol}\`
            ORDER BY AttributesHash, \`${timeBucketCol}\`
          `
        }
      ],
      select: [
        // HDX-1543: If the chart config query asks for an aggregation, the use the computed rate value, otherwise
        // use the underlying summed value. The alias field appears before the spread so user defined aliases will
        // take precedent over our generic value.
        _select.aggFn ? {
          alias: "Value",
          ..._select,
          valueExpression: "Rate",
          aggCondition: ""
        } : {
          alias: "Value",
          ..._select,
          valueExpression: "last_value(Sum)",
          aggCondition: ""
        }
      ],
      from: {
        databaseName: "",
        tableName: "Bucketed"
      },
      where: "",
      // clear up the condition since the where clause is already applied at the upstream CTE
      timestampValueExpression: `\`${timeBucketCol}\``
    };
  } else if (metricType === _types.MetricsDataType.Histogram && metricName) {
    const { aggFn, level, alias, ..._selectRest } = _select;
    if (aggFn !== "quantile" || level == null) {
      throw new Error("quantile must be specified for histogram metrics");
    }
    const valueAlias = alias || "Value";
    const cteChartConfig = {
      ...chartConfig,
      from: {
        ...from,
        tableName: metricTables[_types.MetricsDataType.Histogram]
      },
      filters: [
        ..._nullishCoalesce(filters, () => ( [])),
        {
          type: "sql",
          condition: `MetricName = '${metricName}'`
        }
      ],
      includedDataInterval: chartConfig.granularity === "auto" && Array.isArray(chartConfig.dateRange) ? _utils.convertDateRangeToGranularityString.call(void 0, chartConfig.dateRange, 60) : chartConfig.granularity
    };
    const timeBucketSelect = isUsingGranularity(cteChartConfig) ? timeBucketExpr({
      interval: cteChartConfig.granularity,
      timestampValueExpression: cteChartConfig.timestampValueExpression,
      dateRange: cteChartConfig.dateRange
    }) : _clickhouse.chSql``;
    const where2 = await renderWhere(cteChartConfig, metadata);
    let groupBy;
    if (isUsingGroupBy(chartConfig)) {
      groupBy = _clickhouse.concatChSql.call(void 0, 
        ",",
        await renderSelectList(chartConfig.groupBy, chartConfig, metadata)
      );
    }
    return {
      ...restChartConfig,
      with: [
        {
          name: "source",
          sql: _clickhouse.chSql`
          SELECT
            MetricName,
            ExplicitBounds,
            ${timeBucketSelect.sql ? _clickhouse.chSql`${timeBucketSelect},` : "TimeUnix AS `__hdx_time_bucket`"}
            ${groupBy ? _clickhouse.chSql`[${groupBy}] as group,` : ""}
            sumForEach(deltas) as rates
          FROM (
            SELECT
              TimeUnix,
              MetricName,
              ResourceAttributes,
              Attributes,
              ExplicitBounds,
              attr_hash,
              any(attr_hash) OVER (ROWS BETWEEN 1 preceding AND 1 preceding) AS prev_attr_hash,
              any(bounds_hash) OVER (ROWS BETWEEN 1 preceding AND 1 preceding) AS prev_bounds_hash,
              any(counts) OVER (ROWS BETWEEN 1 preceding AND 1 preceding) AS prev_counts,
              counts,
              IF(
                  AggregationTemporality = 1 ${""}
                      OR prev_attr_hash != attr_hash ${""}
                      OR bounds_hash != prev_bounds_hash ${""}
                      OR arrayExists((x) -> x.2 < x.1, arrayZip(prev_counts, counts)), ${""}
                  counts,
                  counts - prev_counts
              ) AS deltas
            FROM (
              SELECT
                  TimeUnix,
                  MetricName,
                  AggregationTemporality,
                  ExplicitBounds,
                  ResourceAttributes,
                  Attributes,
                  cityHash64(mapConcat(ScopeAttributes, ResourceAttributes, Attributes)) AS attr_hash,
                  cityHash64(ExplicitBounds) AS bounds_hash,
                  CAST(BucketCounts AS Array(Int64)) counts
              FROM ${renderFrom({ from: { ...from, tableName: metricTables[_types.MetricsDataType.Histogram] } })}
              WHERE ${where2}
              ORDER BY attr_hash, TimeUnix ASC
            )
          )
          GROUP BY \`__hdx_time_bucket\`, MetricName, ${groupBy ? "group, " : ""}ExplicitBounds
          ORDER BY \`__hdx_time_bucket\`
          `
        },
        {
          name: "points",
          sql: _clickhouse.chSql`
          SELECT
            \`__hdx_time_bucket\`,
            MetricName,
            ${groupBy ? "group," : ""}
            arrayZipUnaligned(arrayCumSum(rates), ExplicitBounds) as point,
            length(point) as n
          FROM source
          `
        },
        {
          name: "metrics",
          sql: _clickhouse.chSql`
          SELECT
            \`__hdx_time_bucket\`,
            MetricName,
            ${groupBy ? "group," : ""}
            point[n].1 AS total,
            ${{ Float64: level }} * total AS rank,
            arrayFirstIndex(x -> if(x.1 > rank, 1, 0), point) AS upper_idx,
            point[upper_idx].1 AS upper_count,
            ifNull(point[upper_idx].2, inf) AS upper_bound,
            CASE
              WHEN upper_idx > 1 THEN point[upper_idx - 1].2
              WHEN point[upper_idx].2 > 0 THEN 0
              ELSE inf
            END AS lower_bound,
            if (
              lower_bound = 0,
              0,
              point[upper_idx - 1].1
            ) AS lower_count,
            CASE
                WHEN upper_bound = inf THEN point[upper_idx - 1].2
                WHEN lower_bound = inf THEN point[1].2
                ELSE lower_bound + (upper_bound - lower_bound) * ((rank - lower_count) / (upper_count - lower_count))
            END AS ${valueAlias}
          FROM points
          WHERE length(point) > 1 AND total > 0
          `
        }
      ],
      select: `\`__hdx_time_bucket\`${groupBy ? ", group" : ""}, ${valueAlias}`,
      from: {
        databaseName: "",
        tableName: "metrics"
      },
      where: "",
      // clear up the condition since the where clause is already applied at the upstream CTE
      groupBy: void 0,
      granularity: void 0,
      // time bucketing and granularity is applied at the source CTE
      timestampValueExpression: "`__hdx_time_bucket`",
      settings: _clickhouse.chSql`short_circuit_function_evaluation = 'force_enable'`
    };
  }
  throw new Error(`no query support for metric type=${metricType}`);
}
async function renderChartConfig(rawChartConfig, metadata) {
  const chartConfig = isMetricChartConfig(rawChartConfig) ? await translateMetricChartConfig(rawChartConfig, metadata) : rawChartConfig;
  const withClauses = await renderWith(chartConfig, metadata);
  const select = await renderSelect(chartConfig, metadata);
  const from = renderFrom(chartConfig);
  const where = await renderWhere(chartConfig, metadata);
  const groupBy = await renderGroupBy(chartConfig, metadata);
  const orderBy = renderOrderBy(chartConfig);
  const limit = renderLimit(chartConfig);
  return _clickhouse.concatChSql.call(void 0, " ", [
    _clickhouse.chSql`${_optionalChain([withClauses, 'optionalAccess', _42 => _42.sql]) ? _clickhouse.chSql`WITH ${withClauses}` : ""}`,
    _clickhouse.chSql`SELECT ${select}`,
    _clickhouse.chSql`FROM ${from}`,
    _clickhouse.chSql`${where.sql ? _clickhouse.chSql`WHERE ${where}` : ""}`,
    _clickhouse.chSql`${_optionalChain([groupBy, 'optionalAccess', _43 => _43.sql]) ? _clickhouse.chSql`GROUP BY ${groupBy}` : ""}`,
    _clickhouse.chSql`${_optionalChain([orderBy, 'optionalAccess', _44 => _44.sql]) ? _clickhouse.chSql`ORDER BY ${orderBy}` : ""}`,
    //chSql`${fill?.sql ? chSql`WITH FILL ${fill}` : ''}`,
    _clickhouse.chSql`${_optionalChain([limit, 'optionalAccess', _45 => _45.sql]) ? _clickhouse.chSql`LIMIT ${limit}` : ""}`,
    _clickhouse.chSql`${"settings" in chartConfig ? _clickhouse.chSql`SETTINGS ${chartConfig.settings}` : []}`
  ]);
}









exports.FIXED_TIME_BUCKET_EXPR_ALIAS = FIXED_TIME_BUCKET_EXPR_ALIAS; exports.inverseSqlAstFilter = inverseSqlAstFilter; exports.isMetricChartConfig = isMetricChartConfig; exports.isNonEmptyWhereExpr = isNonEmptyWhereExpr; exports.isUsingGroupBy = isUsingGroupBy; exports.renderChartConfig = renderChartConfig; exports.setChartSelectsAlias = setChartSelectsAlias; exports.splitChartConfigs = splitChartConfigs;
