"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } function _optionalChainDelete(ops) { const result = _optionalChain(ops); return result == null ? true : result; } var _class;


var _chunkTBQHB7JCjs = require('./chunk-TBQHB7JC.js');







var _chunk3VOIEFG6js = require('./chunk-3VOIEFG6.js');

// src/queryParser.ts
var _lucene = require('@hyperdx/lucene'); var _lucene2 = _interopRequireDefault(_lucene);
var _sqlstring = require('sqlstring'); var _sqlstring2 = _interopRequireDefault(_sqlstring);

// src/clickhouse.ts
var _nodesqlparser = require('node-sql-parser'); var SQLParser2 = _interopRequireWildcard(_nodesqlparser); var SQLParser = _interopRequireWildcard(_nodesqlparser);
var _objecthash = require('object-hash'); var _objecthash2 = _interopRequireDefault(_objecthash);

// src/renderChartConfig.ts
var _isPlainObject = require('lodash/isPlainObject'); var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var DEFAULT_METRIC_TABLE_TIME_COLUMN = "TimeUnix";
var FIXED_TIME_BUCKET_EXPR_ALIAS = "__hdx_time_bucket";
function isUsingGroupBy(chartConfig) {
  return chartConfig.groupBy != null && chartConfig.groupBy.length > 0;
}
function isUsingGranularity(chartConfig) {
  return chartConfig.timestampValueExpression != null && chartConfig.granularity != null;
}
var isMetricChartConfig = (chartConfig) => {
  return chartConfig.metricTables != null;
};
var setChartSelectsAlias = (config) => {
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
var splitChartConfigs = (config) => {
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
var INVERSE_OPERATOR_MAP = {
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
var fastifySQL = ({
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
var aggFnExpr = ({
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
    return chSql`${fn}(${{
      UNSAFE_RAW_SQL: _nullishCoalesce(expr, () => ( ""))
    }})`;
  } else if (fn.endsWith("State")) {
    if (expr == null || isCount) {
      return isWhereUsed ? chSql`${fn}(${{ UNSAFE_RAW_SQL: where }})` : chSql`${fn}()`;
    }
    return chSql`${fn}(${unsafeExpr}${isWhereUsed ? chSql`, ${{ UNSAFE_RAW_SQL: whereWithExtraNullCheck }}` : ""})`;
  }
  if (fn === "count") {
    if (isWhereUsed) {
      return chSql`${fn}If(${{ UNSAFE_RAW_SQL: where }})`;
    }
    return {
      sql: `${fn}()`,
      params: {}
    };
  }
  if (expr != null) {
    if (fn === "count_distinct") {
      return chSql`count${isWhereUsed ? "If" : ""}(DISTINCT ${{
        UNSAFE_RAW_SQL: expr
      }}${isWhereUsed ? chSql`, ${{ UNSAFE_RAW_SQL: where }}` : ""})`;
    }
    if (quantileLevel != null) {
      return chSql`quantile${isWhereUsed ? "If" : ""}(${{
        // Using Float64 param leads to an added coersion, but we don't need to
        // escape number values anyways
        UNSAFE_RAW_SQL: Number.isFinite(quantileLevel) ? `${quantileLevel}` : "0"
      }})(${unsafeExpr}${isWhereUsed ? chSql`, ${{ UNSAFE_RAW_SQL: whereWithExtraNullCheck }}` : ""})`;
    }
    return chSql`${{ UNSAFE_RAW_SQL: fn }}${isWhereUsed ? "If" : ""}(
      ${unsafeExpr}${isWhereUsed ? chSql`, ${{ UNSAFE_RAW_SQL: whereWithExtraNullCheck }}` : ""}
    )`;
  } else {
    throw new Error(
      "Column is required for all non-count aggregation functions"
    );
  }
};
async function renderSelectList(selectList, chartConfig, metadata) {
  if (typeof selectList === "string") {
    return chSql`${{ UNSAFE_RAW_SQL: selectList }}`;
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
        expr = chSql`${{ UNSAFE_RAW_SQL: select.valueExpression }}`;
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
      return chSql`${expr}${select.alias != null ? chSql` AS "${{ UNSAFE_RAW_SQL: select.alias }}"` : []}`;
    })
  );
  return isRatio ? [chSql`divide(${selectsSQL[0]}, ${selectsSQL[1]})`] : selectsSQL;
}
function renderSortSpecificationList(sortSpecificationList) {
  if (typeof sortSpecificationList === "string") {
    return chSql`${{ UNSAFE_RAW_SQL: sortSpecificationList }}`;
  }
  return sortSpecificationList.map((sortSpecification) => {
    return chSql`${{ UNSAFE_RAW_SQL: sortSpecification.valueExpression }} ${sortSpecification.ordering === "DESC" ? "DESC" : "ASC"}`;
  });
}
function timeBucketExpr({
  interval,
  timestampValueExpression,
  dateRange,
  alias = FIXED_TIME_BUCKET_EXPR_ALIAS
}) {
  const unsafeTimestampValueExpression = {
    UNSAFE_RAW_SQL: _chunk3VOIEFG6js.getFirstTimestampValueExpression.call(void 0, timestampValueExpression)
  };
  const unsafeInterval = {
    UNSAFE_RAW_SQL: interval === "auto" && Array.isArray(dateRange) ? _chunk3VOIEFG6js.convertDateRangeToGranularityString.call(void 0, dateRange, 60) : interval
  };
  return chSql`toStartOfInterval(toDateTime(${unsafeTimestampValueExpression}), INTERVAL ${unsafeInterval}) AS \`${{
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
  const valueExpressions = _chunk3VOIEFG6js.splitAndTrimWithBracket.call(void 0, timestampValueExpression);
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
      const startTimeCond = includedDataInterval ? chSql`toStartOfInterval(fromUnixTimestamp64Milli(${{ Int64: startTime }}), INTERVAL ${includedDataInterval}) - INTERVAL ${includedDataInterval}` : chSql`fromUnixTimestamp64Milli(${{ Int64: startTime }})`;
      const endTimeCond = includedDataInterval ? chSql`toStartOfInterval(fromUnixTimestamp64Milli(${{ Int64: endTime }}), INTERVAL ${includedDataInterval}) + INTERVAL ${includedDataInterval}` : chSql`fromUnixTimestamp64Milli(${{ Int64: endTime }})`;
      if (_optionalChain([columnMeta, 'optionalAccess', _40 => _40.type]) === "Date") {
        return chSql`(${unsafeTimestampValueExpression} ${dateRangeStartInclusive ? ">=" : ">"} toDate(${startTimeCond}) AND ${unsafeTimestampValueExpression} ${dateRangeEndInclusive ? "<=" : "<"} toDate(${endTimeCond}))`;
      } else {
        return chSql`(${unsafeTimestampValueExpression} ${dateRangeStartInclusive ? ">=" : ">"} ${startTimeCond} AND ${unsafeTimestampValueExpression} ${dateRangeEndInclusive ? "<=" : "<"} ${endTimeCond})`;
      }
    })
  );
  return concatChSql("AND", ...whereExprs);
}
async function renderSelect(chartConfig, metadata) {
  const isIncludingTimeBucket = isUsingGranularity(chartConfig);
  const isIncludingGroupBy = isUsingGroupBy(chartConfig);
  return concatChSql(
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
  return concatChSql(
    ".",
    chSql`${from.databaseName === "" ? "" : { Identifier: from.databaseName }}`,
    chSql`${{
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
    const serializer = new CustomSchemaSQLSerializerV2({
      metadata,
      databaseName: from.databaseName,
      tableName: from.tableName,
      implicitColumnExpression,
      fallbackAttributeExpression,
      columnAliases,
      connectionId
    });
    const builder = new SearchQueryBuilder(condition, serializer);
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
  return chSql`${{ UNSAFE_RAW_SQL: _condition }}`;
}
async function renderWhere(chartConfig, metadata) {
  let whereSearchCondition = [];
  if (isNonEmptyWhereExpr(chartConfig.where)) {
    whereSearchCondition = wrapChSqlIfNotEmpty(
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
        return wrapChSqlIfNotEmpty(
          chSql`${{ UNSAFE_RAW_SQL: filter.left }} ${filter.operator} ${{ UNSAFE_RAW_SQL: filter.right }}`,
          "(",
          ")"
        );
      } else if (filter.type === "lucene" || filter.type === "sql") {
        return wrapChSqlIfNotEmpty(
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
  return concatChSql(
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
    wrapChSqlIfNotEmpty(concatChSql(" OR ", selectSearchConditions), "(", ")"),
    wrapChSqlIfNotEmpty(
      concatChSql(
        chartConfig.filtersLogicalOperator === "OR" ? " OR " : " AND ",
        ...filterConditions
      ),
      "(",
      ")"
    )
  );
}
async function renderGroupBy(chartConfig, metadata) {
  return concatChSql(
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
  return concatChSql(
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
  const offset = chartConfig.limit.offset != null ? chSql` OFFSET ${{ Int32: chartConfig.limit.offset }}` : [];
  return chSql`${{ Int32: chartConfig.limit.limit }}${offset}`;
}
async function renderWith(chartConfig, metadata) {
  const { with: withClauses } = chartConfig;
  if (withClauses) {
    return concatChSql(
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
          if (sql && !_chunkTBQHB7JCjs.ChSqlSchema.safeParse(sql).success) {
            throw new Error("non-conforming sql object in CTE");
          }
          if (chartConfig2 && !_chunkTBQHB7JCjs.ChartConfigSchema.safeParse(chartConfig2).success) {
            throw new Error("non-conforming chartConfig object in CTE");
          }
          const resolvedSql = sql ? sql : await renderChartConfig(chartConfig2, metadata);
          if (clause.isSubquery === false) {
            return chSql`(${resolvedSql}) AS ${{ Identifier: clause.name }}`;
          }
          return chSql`${clause.name} AS (${resolvedSql})`;
        })
      )
    );
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
  if (metricType === "gauge" /* Gauge */ && metricName) {
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
          tableName: metricTables["gauge" /* Gauge */]
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
          sql: chSql`
            SELECT
              *,
              cityHash64(mapConcat(ScopeAttributes, ResourceAttributes, Attributes)) AS AttributesHash
            FROM ${renderFrom({ from: { ...from, tableName: metricTables["gauge" /* Gauge */] } })}
            WHERE ${where2}
          `
        },
        {
          name: "Bucketed",
          sql: chSql`
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
  } else if (metricType === "sum" /* Sum */ && metricName) {
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
          tableName: metricTables["sum" /* Sum */]
        },
        filters: [
          ..._nullishCoalesce(filters, () => ( [])),
          {
            type: "sql",
            condition: `MetricName = '${metricName}'`
          }
        ],
        includedDataInterval: chartConfig.granularity === "auto" && Array.isArray(chartConfig.dateRange) ? _chunk3VOIEFG6js.convertDateRangeToGranularityString.call(void 0, chartConfig.dateRange, 60) : chartConfig.granularity
      },
      metadata
    );
    return {
      ...restChartConfig,
      with: [
        {
          name: "Source",
          sql: chSql`
                SELECT
                  *,
                  cityHash64(mapConcat(ScopeAttributes, ResourceAttributes, Attributes)) AS AttributesHash,
                  IF(AggregationTemporality = 1,
                    SUM(Value) OVER (PARTITION BY AttributesHash ORDER BY AttributesHash, TimeUnix ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
                    deltaSum(Value) OVER (PARTITION BY AttributesHash ORDER BY AttributesHash, TimeUnix ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
                  ) AS Rate,
                  IF(AggregationTemporality = 1, Rate, Value) AS Sum
                FROM ${renderFrom({ from: { ...from, tableName: metricTables["sum" /* Sum */] } })}
                WHERE ${where2}`
        },
        {
          name: "Bucketed",
          sql: chSql`
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
  } else if (metricType === "histogram" /* Histogram */ && metricName) {
    const { aggFn, level, alias, ..._selectRest } = _select;
    if (aggFn !== "quantile" || level == null) {
      throw new Error("quantile must be specified for histogram metrics");
    }
    const valueAlias = alias || "Value";
    const cteChartConfig = {
      ...chartConfig,
      from: {
        ...from,
        tableName: metricTables["histogram" /* Histogram */]
      },
      filters: [
        ..._nullishCoalesce(filters, () => ( [])),
        {
          type: "sql",
          condition: `MetricName = '${metricName}'`
        }
      ],
      includedDataInterval: chartConfig.granularity === "auto" && Array.isArray(chartConfig.dateRange) ? _chunk3VOIEFG6js.convertDateRangeToGranularityString.call(void 0, chartConfig.dateRange, 60) : chartConfig.granularity
    };
    const timeBucketSelect = isUsingGranularity(cteChartConfig) ? timeBucketExpr({
      interval: cteChartConfig.granularity,
      timestampValueExpression: cteChartConfig.timestampValueExpression,
      dateRange: cteChartConfig.dateRange
    }) : chSql``;
    const where2 = await renderWhere(cteChartConfig, metadata);
    let groupBy;
    if (isUsingGroupBy(chartConfig)) {
      groupBy = concatChSql(
        ",",
        await renderSelectList(chartConfig.groupBy, chartConfig, metadata)
      );
    }
    return {
      ...restChartConfig,
      with: [
        {
          name: "source",
          sql: chSql`
          SELECT
            MetricName,
            ExplicitBounds,
            ${timeBucketSelect.sql ? chSql`${timeBucketSelect},` : "TimeUnix AS `__hdx_time_bucket`"}
            ${groupBy ? chSql`[${groupBy}] as group,` : ""}
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
              FROM ${renderFrom({ from: { ...from, tableName: metricTables["histogram" /* Histogram */] } })}
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
          sql: chSql`
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
          sql: chSql`
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
      settings: chSql`short_circuit_function_evaluation = 'force_enable'`
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
  return concatChSql(" ", [
    chSql`${_optionalChain([withClauses, 'optionalAccess', _42 => _42.sql]) ? chSql`WITH ${withClauses}` : ""}`,
    chSql`SELECT ${select}`,
    chSql`FROM ${from}`,
    chSql`${where.sql ? chSql`WHERE ${where}` : ""}`,
    chSql`${_optionalChain([groupBy, 'optionalAccess', _43 => _43.sql]) ? chSql`GROUP BY ${groupBy}` : ""}`,
    chSql`${_optionalChain([orderBy, 'optionalAccess', _44 => _44.sql]) ? chSql`ORDER BY ${orderBy}` : ""}`,
    //chSql`${fill?.sql ? chSql`WITH FILL ${fill}` : ''}`,
    chSql`${_optionalChain([limit, 'optionalAccess', _45 => _45.sql]) ? chSql`LIMIT ${limit}` : ""}`,
    chSql`${"settings" in chartConfig ? chSql`SETTINGS ${chartConfig.settings}` : []}`
  ]);
}

// src/clickhouse.ts
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
var getResponseHeaders = (response) => {
  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
};
var convertCHDataTypeToJSType = (dataType) => {
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
var convertCHTypeToPrimitiveJSType = (dataType) => {
  const jsType = convertCHDataTypeToJSType(dataType);
  if (jsType === "map" /* Map */ || jsType === "array" /* Array */) {
    throw new Error("Map type is not a primitive type");
  } else if (jsType === "date" /* Date */) {
    return "number" /* Number */;
  }
  return jsType;
};
var hash = (input) => Math.abs(_chunk3VOIEFG6js.hashCode.call(void 0, `${input}`));
var paramHash = (str) => {
  return `HYPERDX_PARAM_${hash(str)}`;
};
var chSql = (strings, ...values) => {
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
var concatChSql = (sep, ...args) => {
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
var isChSqlEmpty = (chSql2) => {
  if (Array.isArray(chSql2)) {
    return chSql2.every((c) => c.sql.length === 0);
  }
  return chSql2.sql.length === 0;
};
var wrapChSqlIfNotEmpty = (sql, left, right) => {
  if (isChSqlEmpty(sql)) {
    return [];
  }
  return chSql`${left}${sql}${right}`;
};
var ClickHouseQueryError = class extends Error {
  constructor(message, query) {
    super(message);
    this.query = query;
    this.name = "ClickHouseQueryError";
  }
};
function extractColumnReference(sql, maxIterations = 10) {
  let iterations = 0;
  while (/\w+\([^()]*\)/.test(sql) && iterations < maxIterations) {
    sql = sql.replace(/\w+\(([^()]*)\)/, "$1");
    iterations++;
  }
  return iterations < maxIterations ? sql.trim() : null;
}
var castToNumber = (value) => {
  if (typeof value === "string") {
    if (value.trim() === "") {
      return NaN;
    }
    return Number(value);
  }
  return value;
};
var computeRatio = (numeratorInput, denominatorInput) => {
  const numerator = castToNumber(numeratorInput);
  const denominator = castToNumber(denominatorInput);
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    return NaN;
  }
  return numerator / denominator;
};
var computeResultSetRatio = (resultSet) => {
  const _meta = resultSet.meta;
  const _data = resultSet.data;
  const timestampColumn = inferTimestampColumn(_nullishCoalesce(_meta, () => ( [])));
  const _restColumns = _optionalChain([_meta, 'optionalAccess', _46 => _46.filter, 'call', _47 => _47((m) => m.name !== _optionalChain([timestampColumn, 'optionalAccess', _48 => _48.name]))]);
  const firstColumn = _optionalChain([_restColumns, 'optionalAccess', _49 => _49[0]]);
  const secondColumn = _optionalChain([_restColumns, 'optionalAccess', _50 => _50[1]]);
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
var localModeFetch = (input, init) => {
  if (!init) init = {};
  const url = new URL(
    input instanceof URL ? input : input instanceof Request ? input.url : input
  );
  const auth = _optionalChain([init, 'access', _51 => _51.headers, 'optionalAccess', _52 => _52["Authorization"]]);
  const [username, password] = window.atob(auth.substring("Bearer".length)).split(":");
   _optionalChainDelete([init, 'access', _53 => _53.headers, 'optionalAccess', _54 => delete _54["Authorization"]]);
  if (username) url.searchParams.set("user", username);
  if (password) url.searchParams.set("password", password);
  return fetch(`${url.toString()}`, init);
};
var standardModeFetch = (input, init) => {
  if (!init) init = {};
   _optionalChainDelete([init, 'access', _55 => _55.headers, 'optionalAccess', _56 => delete _56["Authorization"]]);
  return fetch(input, init);
};
var ClickhouseClient = class {
  
  
  
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
    if (_optionalChain([clickhouse_settings, 'optionalAccess', _57 => _57.max_rows_to_read]) && this.maxRowReadOnly) {
      delete clickhouse_settings["max_rows_to_read"];
    }
    if (_chunk3VOIEFG6js.isBrowser) {
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
    } else if (_chunk3VOIEFG6js.isNode) {
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
          abort_signal: _optionalChain([opts, 'optionalAccess', _58 => _58.abort_signal]),
          connectionId: config.connection,
          clickhouse_settings: _optionalChain([opts, 'optionalAccess', _59 => _59.clickhouse_settings])
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
        const numericColumnName = _optionalChain([numericColumn, 'optionalAccess', _60 => _60[0], 'optionalAccess', _61 => _61.name]);
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
};
var testLocalConnection = async ({
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
var tableExpr = ({
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
    const parser = new SQLParser2.Parser();
    const ast = parser.astify(sql, {
      database: "Postgresql",
      parseOptions: { includeLocations: true }
    });
    if (ast.columns != null) {
      ast.columns.forEach((column) => {
        if (column.as != null) {
          if (column.type === "expr" && column.expr.type === "column_ref") {
            aliasMap[column.as] = column.expr.array_index && _optionalChain([column, 'access', _62 => _62.expr, 'access', _63 => _63.array_index, 'access', _64 => _64[0], 'optionalAccess', _65 => _65.brackets]) ? (
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
  return _optionalChain([filterColumnMetaByType, 'call', _66 => _66(meta, ["date" /* Date */]), 'optionalAccess', _67 => _67[0]]);
}
function inferNumericColumn(meta) {
  return filterColumnMetaByType(meta, ["number" /* Number */]);
}

// src/queryParser.ts
function encodeSpecialTokens(query) {
  return query.replace(/\\\\/g, "HDX_BACKSLASH_LITERAL").replace("http://", "http_COLON_//").replace("https://", "https_COLON_//").replace(/localhost:(\d{1,5})/, "localhost_COLON_$1").replace(/\\:/g, "HDX_COLON");
}
function decodeSpecialTokens(query) {
  return query.replace(/\\"/g, '"').replace(/HDX_BACKSLASH_LITERAL/g, "\\").replace("http_COLON_//", "http://").replace("https_COLON_//", "https://").replace(/localhost_COLON_(\d{1,5})/, "localhost:$1").replace(/HDX_COLON/g, ":");
}
function parse(query) {
  return _lucene2.default.parse(encodeSpecialTokens(query));
}
var IMPLICIT_FIELD = "<implicit>";
var CLICK_HOUSE_JSON_NUMBER_TYPES = [
  "Int8",
  "Int16",
  "Int32",
  "Int64",
  "Int128",
  "Int256",
  "UInt8",
  "UInt16",
  "UInt32",
  "UInt64",
  "UInt128",
  "UInt256",
  "Float32",
  "Float64"
];
var EnglishSerializer = class {
  translateField(field) {
    if (field === IMPLICIT_FIELD) {
      return "event";
    }
    return `'${field}'`;
  }
  operator(op) {
    switch (op) {
      case "NOT":
      case "AND NOT":
        return "AND NOT";
      case "OR NOT":
        return "OR NOT";
      // @ts-ignore TODO: Types need to be fixed upstream
      case "&&":
      case "<implicit>":
      case "AND":
        return "AND";
      // @ts-ignore TODO: Types need to be fixed upstream
      case "||":
      case "OR":
        return "OR";
      default:
        throw new Error(`Unexpected operator. ${op}`);
    }
  }
  async eq(field, term, isNegatedField) {
    return `${this.translateField(field)} ${isNegatedField ? "is not" : "is"} ${term}`;
  }
  async isNotNull(field, isNegatedField) {
    return `${this.translateField(field)} ${isNegatedField ? "is null" : "is not null"}`;
  }
  async gte(field, term) {
    return `${this.translateField(field)} is greater than or equal to ${term}`;
  }
  async lte(field, term) {
    return `${this.translateField(field)} is less than or equal to ${term}`;
  }
  async lt(field, term) {
    return `${this.translateField(field)} is less than ${term}`;
  }
  async gt(field, term) {
    return `${this.translateField(field)} is greater than ${term}`;
  }
  // async fieldSearch(field: string, term: string, isNegatedField: boolean) {
  //   return `${this.translateField(field)} ${
  //     isNegatedField ? 'does not contain' : 'contains'
  //   } ${term}`;
  // }
  async fieldSearch(field, term, isNegatedField, prefixWildcard, suffixWildcard) {
    if (field === IMPLICIT_FIELD) {
      return `${this.translateField(field)} ${prefixWildcard && suffixWildcard ? isNegatedField ? "does not contain" : "contains" : prefixWildcard ? isNegatedField ? "does not end with" : "ends with" : suffixWildcard ? isNegatedField ? "does not start with" : "starts with" : isNegatedField ? "does not have whole word" : "has whole word"} ${term}`;
    } else {
      return `${this.translateField(field)} ${isNegatedField ? "does not contain" : "contains"} ${term}`;
    }
  }
  async range(field, start, end, isNegatedField) {
    return `${field} ${isNegatedField ? "is not" : "is"} between ${start} and ${end}`;
  }
};
var SQLSerializer = (_class = class {constructor() { _class.prototype.__init.call(this); }
  __init() {this.NOT_FOUND_QUERY = "(1 = 0)"}
  operator(op) {
    switch (op) {
      case "NOT":
      case "AND NOT":
        return "AND NOT";
      case "OR NOT":
        return "OR NOT";
      // @ts-ignore TODO: Types need to be fixed upstream
      case "&&":
      case "<implicit>":
      case "AND":
        return "AND";
      // @ts-ignore TODO: Types need to be fixed upstream
      case "||":
      case "OR":
        return "OR";
      default:
        throw new Error(`Unexpected operator. ${op}`);
    }
  }
  // Only for exact string matches
  async eq(field, term, isNegatedField) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === "bool" /* Bool */) {
      const normTerm = `${term}`.trim().toLowerCase();
      return _sqlstring2.default.format(`(?? ${isNegatedField ? "!" : ""}= ?)`, [
        column,
        normTerm === "true" ? 1 : normTerm === "false" ? 0 : parseInt(normTerm)
      ]);
    } else if (propertyType === "number" /* Number */) {
      return _sqlstring2.default.format(
        `(${column} ${isNegatedField ? "!" : ""}= CAST(?, 'Float64'))`,
        [term]
      );
    } else if (propertyType === "json" /* JSON */) {
      return _sqlstring2.default.format(
        `(${_optionalChain([columnJSON, 'optionalAccess', _68 => _68.string])} ${isNegatedField ? "!" : ""}= ?)`,
        [term]
      );
    }
    return _sqlstring2.default.format(`(${column} ${isNegatedField ? "!" : ""}= ?)`, [
      term
    ]);
  }
  async isNotNull(field, isNegatedField) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === "json" /* JSON */) {
      return `notEmpty(${_optionalChain([columnJSON, 'optionalAccess', _69 => _69.string])}) ${isNegatedField ? "!" : ""}= 1`;
    }
    return `notEmpty(${column}) ${isNegatedField ? "!" : ""}= 1`;
  }
  async gte(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === "json" /* JSON */) {
      return _sqlstring2.default.format(`(${_optionalChain([columnJSON, 'optionalAccess', _70 => _70.number])} >= ?)`, [term]);
    }
    return _sqlstring2.default.format(`(${column} >= ?)`, [term]);
  }
  async lte(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === "json" /* JSON */) {
      return _sqlstring2.default.format(`(${_optionalChain([columnJSON, 'optionalAccess', _71 => _71.number])} <= ?)`, [term]);
    }
    return _sqlstring2.default.format(`(${column} <= ?)`, [term]);
  }
  async lt(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === "json" /* JSON */) {
      return _sqlstring2.default.format(`(${_optionalChain([columnJSON, 'optionalAccess', _72 => _72.number])} < ?)`, [term]);
    }
    return _sqlstring2.default.format(`(${column} < ?)`, [term]);
  }
  async gt(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === "json" /* JSON */) {
      return _sqlstring2.default.format(`(${_optionalChain([columnJSON, 'optionalAccess', _73 => _73.number])} > ?)`, [term]);
    }
    return _sqlstring2.default.format(`(${column} > ?)`, [term]);
  }
  // TODO: Not sure if SQL really needs this or if it'll coerce itself
  attemptToParseNumber(term) {
    const number = Number.parseFloat(term);
    if (Number.isNaN(number)) {
      return term;
    }
    return number;
  }
  // Ref: https://clickhouse.com/codebrowser/ClickHouse/src/Functions/HasTokenImpl.h.html#_ZN2DB12HasTokenImpl16isTokenSeparatorEDu
  // Split by anything that's ascii 0-128, that's not a letter or a number
  tokenizeTerm(term) {
    return term.split(/[ -/:-@[-`{-~\t\n\r]+/).filter((t) => t.length > 0);
  }
  termHasSeperators(term) {
    return term.match(/[ -/:-@[-`{-~\t\n\r]+/) != null;
  }
  async fieldSearch(field, term, isNegatedField, prefixWildcard, suffixWildcard) {
    const isImplicitField = field === IMPLICIT_FIELD;
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === "bool" /* Bool */) {
      const normTerm = `${term}`.trim().toLowerCase();
      return _sqlstring2.default.format(`(?? ${isNegatedField ? "!" : ""}= ?)`, [
        column,
        normTerm === "true" ? 1 : normTerm === "false" ? 0 : parseInt(normTerm)
      ]);
    } else if (propertyType === "number" /* Number */) {
      return _sqlstring2.default.format(
        `(?? ${isNegatedField ? "!" : ""}= CAST(?, 'Float64'))`,
        [column, term]
      );
    } else if (propertyType === "json" /* JSON */) {
      return _sqlstring2.default.format(
        `(${_optionalChain([columnJSON, 'optionalAccess', _74 => _74.string])} ${isNegatedField ? "NOT " : ""}ILIKE ?)`,
        [`%${term}%`]
      );
    }
    if (term.length === 0) {
      return "(1=1)";
    }
    if (isImplicitField) {
      if (prefixWildcard || suffixWildcard) {
        return _sqlstring2.default.format(
          `(lower(?) ${isNegatedField ? "NOT " : ""}LIKE lower(?))`,
          [
            _sqlstring2.default.raw(_nullishCoalesce(column, () => ( ""))),
            `${prefixWildcard ? "%" : ""}${term}${suffixWildcard ? "%" : ""}`
          ]
        );
      } else {
        const hasSeperators = this.termHasSeperators(term);
        if (hasSeperators) {
          const tokens = this.tokenizeTerm(term);
          return `(${isNegatedField ? "NOT (" : ""}${[
            ...tokens.map(
              (token) => _sqlstring2.default.format(`hasTokenCaseInsensitive(?, ?)`, [
                _sqlstring2.default.raw(_nullishCoalesce(column, () => ( ""))),
                token
              ])
            ),
            // If there are symbols in the term, we'll try to match the whole term as well (ex. Scott!)
            _sqlstring2.default.format(`(lower(?) LIKE lower(?))`, [
              _sqlstring2.default.raw(_nullishCoalesce(column, () => ( ""))),
              `%${term}%`
            ])
          ].join(" AND ")}${isNegatedField ? ")" : ""})`;
        } else {
          return _sqlstring2.default.format(
            `(${isNegatedField ? "NOT " : ""}hasTokenCaseInsensitive(?, ?))`,
            [_sqlstring2.default.raw(_nullishCoalesce(column, () => ( ""))), term]
          );
        }
      }
    } else {
      const shoudUseTokenBf = isImplicitField;
      return _sqlstring2.default.format(
        `(${column} ${isNegatedField ? "NOT " : ""}? ?)`,
        [_sqlstring2.default.raw(shoudUseTokenBf ? "LIKE" : "ILIKE"), `%${term}%`]
      );
    }
  }
  async range(field, start, end, isNegatedField) {
    const { column, found } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    return _sqlstring2.default.format(
      `(${column} ${isNegatedField ? "NOT " : ""}BETWEEN ? AND ?)`,
      [this.attemptToParseNumber(start), this.attemptToParseNumber(end)]
    );
  }
}, _class);
var CustomSchemaSQLSerializerV2 = class extends SQLSerializer {
  
  
  
  
  
  
  
  constructor({
    metadata,
    databaseName,
    tableName,
    connectionId,
    implicitColumnExpression,
    fallbackAttributeExpression,
    columnAliases
  }) {
    super();
    this.metadata = metadata;
    this.databaseName = databaseName;
    this.tableName = tableName;
    this.implicitColumnExpression = implicitColumnExpression;
    this.fallbackAttributeExpression = fallbackAttributeExpression;
    this.columnAliases = _nullishCoalesce(columnAliases, () => ( {}));
    this.connectionId = connectionId;
  }
  /**
   * Translate field from user ex. column.property.subproperty to SQL expression
   * Supports:
   * - Materialized Columns
   * - Map
   * - JSON Strings (via JSONExtract)
   * TODO:
   * - Nested Map
   * - JSONExtract for non-string types
   */
  async buildColumnExpressionFromField(field) {
    let exactMatch = await this.metadata.getColumn({
      databaseName: this.databaseName,
      tableName: this.tableName,
      column: field,
      connectionId: this.connectionId
    });
    if (!exactMatch && field in this.columnAliases) {
      exactMatch = await this.metadata.getColumn({
        databaseName: this.databaseName,
        tableName: this.tableName,
        column: this.columnAliases[field],
        connectionId: this.connectionId
      });
    }
    if (exactMatch) {
      if (exactMatch.type.startsWith("JSON")) {
        return {
          found: true,
          columnExpression: "",
          columnExpressionJSON: {
            string: _sqlstring2.default.format(`toString(??)`, [exactMatch.name]),
            number: _sqlstring2.default.format(`dynamicType(??) in (?) and ??`, [
              exactMatch.name,
              CLICK_HOUSE_JSON_NUMBER_TYPES,
              exactMatch.name
            ])
          },
          columnType: "JSON"
        };
      }
      return {
        found: true,
        columnType: exactMatch.type,
        columnExpression: exactMatch.name
        // TODO
        // Add JSON excatMatch if want to support whole json compare in future, ex: json:"{a: 1234}""
      };
    }
    const fieldPrefix = field.split(".")[0];
    let prefixMatch = await this.metadata.getColumn({
      databaseName: this.databaseName,
      tableName: this.tableName,
      column: fieldPrefix,
      connectionId: this.connectionId,
      matchLowercase: true
    });
    if (!prefixMatch && fieldPrefix in this.columnAliases) {
      prefixMatch = await this.metadata.getColumn({
        databaseName: this.databaseName,
        tableName: this.tableName,
        column: this.columnAliases[fieldPrefix],
        connectionId: this.connectionId,
        matchLowercase: true
      });
    }
    if (prefixMatch) {
      const fieldPostfix = field.split(".").slice(1).join(".");
      if (prefixMatch.type.startsWith("Map")) {
        const valueType = _optionalChain([prefixMatch, 'access', _75 => _75.type, 'access', _76 => _76.match, 'call', _77 => _77(/,\s+(\w+)\)$/), 'optionalAccess', _78 => _78[1]]);
        return {
          found: true,
          columnExpression: _sqlstring2.default.format(`??[?]`, [
            prefixMatch.name,
            fieldPostfix
          ]),
          columnType: _nullishCoalesce(valueType, () => ( "Unknown"))
        };
      } else if (prefixMatch.type.startsWith("JSON")) {
        const jsonFieldPath = fieldPostfix ? `${prefixMatch.name}.${fieldPostfix}` : prefixMatch.name;
        return {
          found: true,
          columnExpression: "",
          columnExpressionJSON: {
            string: _sqlstring2.default.format(`toString(??)`, [jsonFieldPath]),
            number: _sqlstring2.default.format(`dynamicType(??) in (?) and ??`, [
              jsonFieldPath,
              CLICK_HOUSE_JSON_NUMBER_TYPES,
              jsonFieldPath
            ])
          },
          columnType: "JSON"
        };
      } else if (prefixMatch.type === "String") {
        const nestedPaths = fieldPostfix.split(".");
        return {
          found: true,
          columnExpression: _sqlstring2.default.format(
            `JSONExtractString(??, ${Array(nestedPaths.length).fill("?").join(",")})`,
            [prefixMatch.name, ...nestedPaths]
          ),
          columnType: "String"
        };
      }
      throw new Error("Unsupported column type for prefix match");
    }
    if (this.fallbackAttributeExpression) {
      const segments = field.split(".");
      const accessPath = [this.fallbackAttributeExpression, ...segments].join(
        "."
      );
      return {
        found: true,
        columnExpression: "",
        columnExpressionJSON: {
          string: _sqlstring2.default.format(`toString(??)`, [accessPath]),
          number: _sqlstring2.default.format(`dynamicType(??) in (?) and ??`, [
            accessPath,
            CLICK_HOUSE_JSON_NUMBER_TYPES,
            accessPath
          ])
        },
        columnType: "JSON"
      };
    }
    return {
      found: true,
      columnExpression: field,
      columnType: "Unknown"
    };
  }
  async getColumnForField(field) {
    if (field === IMPLICIT_FIELD) {
      if (!this.implicitColumnExpression) {
        throw new Error(
          "Can not search bare text without an implicit column set."
        );
      }
      const expressions = _chunk3VOIEFG6js.splitAndTrimWithBracket.call(void 0, 
        this.implicitColumnExpression
      );
      return {
        column: expressions.length > 1 ? `concatWithSeparator(';',${expressions.join(",")})` : this.implicitColumnExpression,
        columnJSON: void 0,
        propertyType: "string" /* String */,
        found: true
      };
    }
    const expression = await this.buildColumnExpressionFromField(field);
    return {
      column: expression.columnExpression,
      columnJSON: _optionalChain([expression, 'optionalAccess', _79 => _79.columnExpressionJSON]),
      propertyType: _nullishCoalesce(convertCHTypeToPrimitiveJSType(expression.columnType), () => ( void 0)),
      found: expression.found
    };
  }
};
async function nodeTerm(node, serializer) {
  const field = node.field[0] === "-" ? node.field.slice(1) : node.field;
  let isNegatedField = node.field[0] === "-";
  const isImplicitField = node.field === IMPLICIT_FIELD;
  if (node.term != null) {
    const nodeTerm2 = node;
    let term = decodeSpecialTokens(nodeTerm2.term);
    if (isImplicitField && nodeTerm2.prefix === "-") {
      isNegatedField = true;
    }
    if (!isImplicitField && nodeTerm2.prefix === "-") {
      term = nodeTerm2.prefix + decodeSpecialTokens(nodeTerm2.term);
    }
    if (nodeTerm2.quoted && !isImplicitField) {
      return serializer.eq(field, term, isNegatedField);
    }
    if (!nodeTerm2.quoted && term === "*") {
      return serializer.isNotNull(field, isNegatedField);
    }
    if (!nodeTerm2.quoted && term.substring(0, 2) === ">=") {
      if (isNegatedField) {
        return serializer.lt(field, term.slice(2));
      }
      return serializer.gte(field, term.slice(2));
    }
    if (!nodeTerm2.quoted && term.substring(0, 2) === "<=") {
      if (isNegatedField) {
        return serializer.gt(field, term.slice(2));
      }
      return serializer.lte(field, term.slice(2));
    }
    if (!nodeTerm2.quoted && term[0] === ">") {
      if (isNegatedField) {
        return serializer.lte(field, term.slice(1));
      }
      return serializer.gt(field, term.slice(1));
    }
    if (!nodeTerm2.quoted && term[0] === "<") {
      if (isNegatedField) {
        return serializer.gte(field, term.slice(1));
      }
      return serializer.lt(field, term.slice(1));
    }
    let prefixWildcard = false;
    let suffixWildcard = false;
    if (!nodeTerm2.quoted && term[0] === "*") {
      prefixWildcard = true;
      term = term.slice(1);
    }
    if (!nodeTerm2.quoted && term[term.length - 1] === "*") {
      suffixWildcard = true;
      term = term.slice(0, -1);
    }
    return serializer.fieldSearch(
      field,
      term,
      isNegatedField,
      prefixWildcard,
      suffixWildcard
    );
  }
  if (node.inclusive != null) {
    const rangedTerm = node;
    return serializer.range(
      field,
      rangedTerm.term_min,
      rangedTerm.term_max,
      isNegatedField
    );
  }
  throw new Error(`Unexpected Node type. ${node}`);
}
async function serialize(ast, serializer) {
  if (ast.term != null) {
    return await nodeTerm(ast, serializer);
  }
  if (ast.inclusive != null) {
    return await nodeTerm(ast, serializer);
  }
  if (ast.right != null) {
    const binaryAST = ast;
    const operator = serializer.operator(binaryAST.operator);
    const parenthesized = binaryAST.parenthesized;
    return `${parenthesized ? "(" : ""}${await serialize(
      binaryAST.left,
      serializer
    )} ${operator} ${await serialize(binaryAST.right, serializer)}${parenthesized ? ")" : ""}`;
  }
  if (ast.left != null) {
    const leftOnlyAST = ast;
    const parenthesized = leftOnlyAST.parenthesized;
    return `${parenthesized ? "(" : ""}${leftOnlyAST.start != void 0 ? `${leftOnlyAST.start} ` : ""}${await serialize(leftOnlyAST.left, serializer)}${parenthesized ? ")" : ""}`;
  }
  return "";
}
async function genWhereSQL(ast, serializer) {
  return await serialize(ast, serializer);
}
var SearchQueryBuilder = class {
  
  
  
  constructor(searchQ, serializer) {
    this.conditions = [];
    this.searchQ = searchQ;
    this.serializer = serializer;
  }
  setSerializer(serializer) {
    this.serializer = serializer;
    return this;
  }
  getSerializer() {
    return this.serializer;
  }
  async genSearchQuery() {
    if (!this.searchQ) {
      return "";
    }
    const parsedQ = parse(this.searchQ);
    return await genWhereSQL(parsedQ, this.serializer);
  }
  and(condition) {
    if (condition && condition.trim()) {
      this.conditions.push(`(${condition})`);
    }
    return this;
  }
  async build() {
    const searchQuery = await this.genSearchQuery();
    if (this.searchQ) {
      this.and(searchQuery);
    }
    return this.conditions.join(" AND ");
  }
};
async function genEnglishExplanation(query) {
  try {
    const parsedQ = parse(query);
    if (parsedQ) {
      const serializer = new EnglishSerializer();
      return await serialize(parsedQ, serializer);
    }
  } catch (e) {
    console.warn("Parse failure", query, e);
  }
  return `Message containing ${query}`;
}



































exports.parse = parse; exports.SQLSerializer = SQLSerializer; exports.CustomSchemaSQLSerializerV2 = CustomSchemaSQLSerializerV2; exports.genWhereSQL = genWhereSQL; exports.SearchQueryBuilder = SearchQueryBuilder; exports.genEnglishExplanation = genEnglishExplanation; exports.FIXED_TIME_BUCKET_EXPR_ALIAS = FIXED_TIME_BUCKET_EXPR_ALIAS; exports.isUsingGroupBy = isUsingGroupBy; exports.isMetricChartConfig = isMetricChartConfig; exports.setChartSelectsAlias = setChartSelectsAlias; exports.splitChartConfigs = splitChartConfigs; exports.inverseSqlAstFilter = inverseSqlAstFilter; exports.isNonEmptyWhereExpr = isNonEmptyWhereExpr; exports.renderChartConfig = renderChartConfig; exports.JSDataType = JSDataType; exports.getResponseHeaders = getResponseHeaders; exports.convertCHDataTypeToJSType = convertCHDataTypeToJSType; exports.convertCHTypeToPrimitiveJSType = convertCHTypeToPrimitiveJSType; exports.chSql = chSql; exports.concatChSql = concatChSql; exports.wrapChSqlIfNotEmpty = wrapChSqlIfNotEmpty; exports.ClickHouseQueryError = ClickHouseQueryError; exports.extractColumnReference = extractColumnReference; exports.computeRatio = computeRatio; exports.computeResultSetRatio = computeResultSetRatio; exports.ClickhouseClient = ClickhouseClient; exports.testLocalConnection = testLocalConnection; exports.tableExpr = tableExpr; exports.parameterizedQueryToSql = parameterizedQueryToSql; exports.chSqlToAliasMap = chSqlToAliasMap; exports.filterColumnMetaByType = filterColumnMetaByType; exports.inferTimestampColumn = inferTimestampColumn; exports.inferNumericColumn = inferNumericColumn;
