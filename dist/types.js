"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');
var MetricsDataType = /* @__PURE__ */ ((MetricsDataType2) => {
  MetricsDataType2["Gauge"] = "gauge";
  MetricsDataType2["Histogram"] = "histogram";
  MetricsDataType2["Sum"] = "sum";
  MetricsDataType2["Summary"] = "summary";
  MetricsDataType2["ExponentialHistogram"] = "exponential histogram";
  return MetricsDataType2;
})(MetricsDataType || {});
var DisplayType = /* @__PURE__ */ ((DisplayType2) => {
  DisplayType2["Line"] = "line";
  DisplayType2["StackedBar"] = "stacked_bar";
  DisplayType2["Table"] = "table";
  DisplayType2["Number"] = "number";
  DisplayType2["Search"] = "search";
  DisplayType2["Heatmap"] = "heatmap";
  DisplayType2["Markdown"] = "markdown";
  return DisplayType2;
})(DisplayType || {});
const MetricTableSchema = _zod.z.object(
  Object.values(MetricsDataType).reduce(
    (acc, key) => ({
      ...acc,
      [key]: _zod.z.string().optional()
    }),
    {}
  )
).refine(
  (tables) => Object.values(tables).some((table) => table && table.length > 0),
  { message: "At least one metric table must be specified" }
);
const SQLIntervalSchema = _zod.z.string().regex(/^\d+ (second|minute|hour|day)$/);
const SearchConditionSchema = _zod.z.string();
const SearchConditionLanguageSchema = _zod.z.enum(["sql", "lucene"]).optional();
const AggregateFunctionSchema = _zod.z.enum([
  "avg",
  "count",
  "count_distinct",
  "last_value",
  "max",
  "min",
  "quantile",
  "sum"
]);
const AggregateFunctionWithCombinatorsSchema = _zod.z.string().regex(/^(\w+)If(State|Merge)$/);
const RootValueExpressionSchema = _zod.z.object({
  aggFn: _zod.z.union([
    AggregateFunctionSchema,
    AggregateFunctionWithCombinatorsSchema
  ]),
  aggCondition: SearchConditionSchema,
  aggConditionLanguage: SearchConditionLanguageSchema,
  valueExpression: _zod.z.string()
}).or(
  _zod.z.object({
    aggFn: _zod.z.literal("quantile"),
    level: _zod.z.number(),
    aggCondition: SearchConditionSchema,
    aggConditionLanguage: SearchConditionLanguageSchema,
    valueExpression: _zod.z.string()
  })
).or(
  _zod.z.object({
    aggFn: _zod.z.string().optional(),
    aggCondition: _zod.z.string().optional(),
    aggConditionLanguage: SearchConditionLanguageSchema,
    valueExpression: _zod.z.string(),
    metricType: _zod.z.nativeEnum(MetricsDataType).optional()
  })
);
const DerivedColumnSchema = _zod.z.intersection(
  RootValueExpressionSchema,
  _zod.z.object({
    alias: _zod.z.string().optional(),
    metricType: _zod.z.nativeEnum(MetricsDataType).optional(),
    metricName: _zod.z.string().optional()
  })
);
const SelectListSchema = _zod.z.array(DerivedColumnSchema).or(_zod.z.string());
const SortSpecificationSchema = _zod.z.intersection(
  RootValueExpressionSchema,
  _zod.z.object({
    ordering: _zod.z.enum(["ASC", "DESC"])
  })
);
const SortSpecificationListSchema = _zod.z.array(SortSpecificationSchema).or(_zod.z.string());
const LimitSchema = _zod.z.object({
  limit: _zod.z.number().optional(),
  offset: _zod.z.number().optional()
});
const ChSqlSchema = _zod.z.object({
  sql: _zod.z.string(),
  params: _zod.z.record(_zod.z.string(), _zod.z.any())
});
const SelectSQLStatementSchema = _zod.z.object({
  select: SelectListSchema,
  from: _zod.z.object({
    databaseName: _zod.z.string(),
    tableName: _zod.z.string()
  }),
  where: SearchConditionSchema,
  whereLanguage: SearchConditionLanguageSchema,
  groupBy: SelectListSchema.optional(),
  having: SearchConditionSchema.optional(),
  havingLanguage: SearchConditionLanguageSchema.optional(),
  orderBy: SortSpecificationListSchema.optional(),
  limit: LimitSchema.optional()
});
var WebhookService = /* @__PURE__ */ ((WebhookService2) => {
  WebhookService2["Slack"] = "slack";
  WebhookService2["Generic"] = "generic";
  return WebhookService2;
})(WebhookService || {});
var AlertThresholdType = /* @__PURE__ */ ((AlertThresholdType2) => {
  AlertThresholdType2["ABOVE"] = "above";
  AlertThresholdType2["BELOW"] = "below";
  return AlertThresholdType2;
})(AlertThresholdType || {});
var AlertState = /* @__PURE__ */ ((AlertState2) => {
  AlertState2["ALERT"] = "ALERT";
  AlertState2["DISABLED"] = "DISABLED";
  AlertState2["INSUFFICIENT_DATA"] = "INSUFFICIENT_DATA";
  AlertState2["OK"] = "OK";
  return AlertState2;
})(AlertState || {});
var AlertSource = /* @__PURE__ */ ((AlertSource2) => {
  AlertSource2["SAVED_SEARCH"] = "saved_search";
  AlertSource2["TILE"] = "tile";
  return AlertSource2;
})(AlertSource || {});
const AlertIntervalSchema = _zod.z.union([
  _zod.z.literal("1m"),
  _zod.z.literal("5m"),
  _zod.z.literal("15m"),
  _zod.z.literal("30m"),
  _zod.z.literal("1h"),
  _zod.z.literal("6h"),
  _zod.z.literal("12h"),
  _zod.z.literal("1d")
]);
const zAlertChannelType = _zod.z.literal("webhook");
const zAlertChannel = _zod.z.object({
  type: zAlertChannelType,
  webhookId: _zod.z.string().nonempty("Webhook ID can't be empty")
});
const zSavedSearchAlert = _zod.z.object({
  source: _zod.z.literal("saved_search" /* SAVED_SEARCH */),
  groupBy: _zod.z.string().optional(),
  savedSearchId: _zod.z.string().min(1)
});
const zTileAlert = _zod.z.object({
  source: _zod.z.literal("tile" /* TILE */),
  tileId: _zod.z.string().min(1),
  dashboardId: _zod.z.string().min(1)
});
const AlertBaseSchema = _zod.z.object({
  id: _zod.z.string().optional(),
  interval: AlertIntervalSchema,
  threshold: _zod.z.number().int().min(1),
  thresholdType: _zod.z.nativeEnum(AlertThresholdType),
  channel: zAlertChannel,
  state: _zod.z.nativeEnum(AlertState).optional(),
  name: _zod.z.string().min(1).max(512).nullish(),
  message: _zod.z.string().min(1).max(4096).nullish(),
  silenced: _zod.z.object({
    by: _zod.z.string(),
    at: _zod.z.string(),
    until: _zod.z.string()
  }).optional()
});
const ChartAlertBaseSchema = AlertBaseSchema.extend({
  threshold: _zod.z.number().positive()
});
const AlertSchema = _zod.z.union([
  _zod.z.intersection(AlertBaseSchema, zSavedSearchAlert),
  _zod.z.intersection(ChartAlertBaseSchema, zTileAlert)
]);
const SavedSearchSchema = _zod.z.object({
  id: _zod.z.string(),
  name: _zod.z.string(),
  select: _zod.z.string(),
  where: _zod.z.string(),
  whereLanguage: SearchConditionLanguageSchema,
  source: _zod.z.string(),
  tags: _zod.z.array(_zod.z.string()),
  orderBy: _zod.z.string().optional(),
  alerts: _zod.z.array(AlertSchema).optional()
});
const NumberFormatSchema = _zod.z.object({
  output: _zod.z.enum(["currency", "percent", "byte", "time", "number"]),
  mantissa: _zod.z.number().optional(),
  thousandSeparated: _zod.z.boolean().optional(),
  average: _zod.z.boolean().optional(),
  decimalBytes: _zod.z.boolean().optional(),
  factor: _zod.z.number().optional(),
  currencySymbol: _zod.z.string().optional(),
  unit: _zod.z.string().optional()
});
const SqlAstFilterSchema = _zod.z.object({
  type: _zod.z.literal("sql_ast"),
  operator: _zod.z.enum(["=", "<", ">", "!=", "<=", ">="]),
  left: _zod.z.string(),
  right: _zod.z.string()
});
const FilterSchema = _zod.z.union([
  _zod.z.object({
    type: _zod.z.enum(["lucene", "sql"]),
    condition: _zod.z.string()
  }),
  SqlAstFilterSchema
]);
const _ChartConfigSchema = _zod.z.object({
  displayType: _zod.z.nativeEnum(DisplayType).optional(),
  numberFormat: NumberFormatSchema.optional(),
  timestampValueExpression: _zod.z.string(),
  implicitColumnExpression: _zod.z.string().optional(),
  fallbackAttributeExpression: _zod.z.string().optional(),
  columnAliases: _zod.z.record(_zod.z.string(), _zod.z.string()).optional(),
  granularity: _zod.z.union([SQLIntervalSchema, _zod.z.literal("auto")]).optional(),
  markdown: _zod.z.string().optional(),
  filtersLogicalOperator: _zod.z.enum(["AND", "OR"]).optional(),
  filters: _zod.z.array(FilterSchema).optional(),
  connection: _zod.z.string(),
  fillNulls: _zod.z.union([_zod.z.number(), _zod.z.literal(false)]).optional(),
  selectGroupBy: _zod.z.boolean().optional(),
  metricTables: MetricTableSchema.optional(),
  seriesReturnType: _zod.z.enum(["ratio", "column"]).optional()
});
const CteChartConfigSchema = _zod.z.intersection(
  _ChartConfigSchema.partial({ timestampValueExpression: true }),
  SelectSQLStatementSchema
);
const ChartConfigSchema = _zod.z.intersection(
  _zod.z.intersection(_ChartConfigSchema, SelectSQLStatementSchema),
  _zod.z.object({
    with: _zod.z.array(
      _zod.z.object({
        name: _zod.z.string(),
        // Need to specify either a sql or chartConfig instance. To avoid
        // the schema falling into an any type, the fields are separate
        // and listed as optional.
        sql: ChSqlSchema.optional(),
        chartConfig: CteChartConfigSchema.optional(),
        // If true, it'll render as WITH ident AS (subquery)
        // If false, it'll be a "variable" ex. WITH (sql) AS ident
        // where sql can be any expression, ex. a constant string
        // see: https://clickhouse.com/docs/sql-reference/statements/select/with#syntax
        // default assume true
        isSubquery: _zod.z.boolean().optional()
      })
    )
  }).partial()
);
const SavedChartConfigSchema = _zod.z.intersection(
  _zod.z.intersection(
    _zod.z.object({
      name: _zod.z.string(),
      source: _zod.z.string(),
      alert: _zod.z.union([
        AlertBaseSchema.optional(),
        ChartAlertBaseSchema.optional()
      ])
    }),
    _ChartConfigSchema.omit({
      connection: true,
      timestampValueExpression: true
    })
  ),
  SelectSQLStatementSchema.omit({
    from: true
  })
);
const TileSchema = _zod.z.object({
  id: _zod.z.string(),
  x: _zod.z.number(),
  y: _zod.z.number(),
  w: _zod.z.number(),
  h: _zod.z.number(),
  config: SavedChartConfigSchema
});
const DashboardSchema = _zod.z.object({
  id: _zod.z.string(),
  name: _zod.z.string().min(1),
  tiles: _zod.z.array(TileSchema),
  tags: _zod.z.array(_zod.z.string())
});
const DashboardWithoutIdSchema = DashboardSchema.omit({ id: true });
const ConnectionSchema = _zod.z.object({
  id: _zod.z.string(),
  name: _zod.z.string(),
  host: _zod.z.string(),
  username: _zod.z.string(),
  password: _zod.z.string().optional()
});
var SourceKind = /* @__PURE__ */ ((SourceKind2) => {
  SourceKind2["Log"] = "log";
  SourceKind2["Trace"] = "trace";
  SourceKind2["Session"] = "session";
  SourceKind2["Metric"] = "metric";
  return SourceKind2;
})(SourceKind || {});
const SourceBaseSchema = _zod.z.object({
  id: _zod.z.string(),
  name: _zod.z.string().min(1, "Name is required"),
  kind: _zod.z.nativeEnum(SourceKind),
  connection: _zod.z.string().min(1, "Server Connection is required"),
  from: _zod.z.object({
    databaseName: _zod.z.string().min(1, "Database is required"),
    tableName: _zod.z.string().min(1, "Table is required")
  }),
  timestampValueExpression: _zod.z.string().min(1, "Timestamp Column is required")
});
const LogSourceAugmentation = {
  kind: _zod.z.literal("log" /* Log */),
  defaultTableSelectExpression: _zod.z.string({
    message: "Default Table Select Expression is required"
  }),
  // Optional fields for logs
  serviceNameExpression: _zod.z.string().optional(),
  severityTextExpression: _zod.z.string().optional(),
  bodyExpression: _zod.z.string().optional(),
  eventAttributesExpression: _zod.z.string().optional(),
  resourceAttributesExpression: _zod.z.string().optional(),
  displayedTimestampValueExpression: _zod.z.string().optional(),
  metricSourceId: _zod.z.string().optional(),
  traceSourceId: _zod.z.string().optional(),
  traceIdExpression: _zod.z.string().optional(),
  spanIdExpression: _zod.z.string().optional(),
  implicitColumnExpression: _zod.z.string().optional(),
  uniqueRowIdExpression: _zod.z.string().optional(),
  tableFilterExpression: _zod.z.string().optional()
};
const TraceSourceAugmentation = {
  kind: _zod.z.literal("trace" /* Trace */),
  defaultTableSelectExpression: _zod.z.string().optional(),
  // Required fields for traces
  durationExpression: _zod.z.string().min(1, "Duration Expression is required"),
  durationPrecision: _zod.z.number().min(0).max(9).default(3),
  traceIdExpression: _zod.z.string().min(1, "Trace ID Expression is required"),
  spanIdExpression: _zod.z.string().min(1, "Span ID Expression is required"),
  parentSpanIdExpression: _zod.z.string().min(1, "Parent span ID expression is required"),
  spanNameExpression: _zod.z.string().min(1, "Span Name Expression is required"),
  spanKindExpression: _zod.z.string().min(1, "Span Kind Expression is required"),
  // Optional fields for traces
  logSourceId: _zod.z.string().optional().nullable(),
  sessionSourceId: _zod.z.string().optional(),
  metricSourceId: _zod.z.string().optional(),
  statusCodeExpression: _zod.z.string().optional(),
  statusMessageExpression: _zod.z.string().optional(),
  serviceNameExpression: _zod.z.string().optional(),
  resourceAttributesExpression: _zod.z.string().optional(),
  eventAttributesExpression: _zod.z.string().optional(),
  spanEventsValueExpression: _zod.z.string().optional(),
  implicitColumnExpression: _zod.z.string().optional()
};
const SessionSourceAugmentation = {
  kind: _zod.z.literal("session" /* Session */),
  // Required fields for sessions
  eventAttributesExpression: _zod.z.string().min(1, "Log Attributes Expression is required"),
  resourceAttributesExpression: _zod.z.string().min(1, "Resource Attributes Expression is required"),
  traceSourceId: _zod.z.string({ message: "Correlated Trace Source is required" }).min(1, "Correlated Trace Source is required"),
  // Optional fields for sessions
  implicitColumnExpression: _zod.z.string().optional()
};
const MetricSourceAugmentation = {
  kind: _zod.z.literal("metric" /* Metric */),
  // override from SourceBaseSchema
  from: _zod.z.object({
    databaseName: _zod.z.string().min(1, "Database is required"),
    tableName: _zod.z.string()
  }),
  // Metric tables - at least one should be provided
  metricTables: MetricTableSchema,
  resourceAttributesExpression: _zod.z.string().min(1, "Resource Attributes is required"),
  // Optional fields for metrics
  logSourceId: _zod.z.string().optional()
};
const SourceSchema = _zod.z.discriminatedUnion("kind", [
  SourceBaseSchema.extend(LogSourceAugmentation),
  SourceBaseSchema.extend(TraceSourceAugmentation),
  SourceBaseSchema.extend(SessionSourceAugmentation),
  SourceBaseSchema.extend(MetricSourceAugmentation)
]);
function sourceSchemaWithout(omissions = {}) {
  return _zod.z.discriminatedUnion("kind", [
    SourceBaseSchema.omit(omissions).extend(LogSourceAugmentation),
    SourceBaseSchema.omit(omissions).extend(TraceSourceAugmentation),
    SourceBaseSchema.omit(omissions).extend(SessionSourceAugmentation),
    SourceBaseSchema.omit(omissions).extend(MetricSourceAugmentation)
  ]);
}












































exports.AggregateFunctionSchema = AggregateFunctionSchema; exports.AggregateFunctionWithCombinatorsSchema = AggregateFunctionWithCombinatorsSchema; exports.AlertBaseSchema = AlertBaseSchema; exports.AlertIntervalSchema = AlertIntervalSchema; exports.AlertSchema = AlertSchema; exports.AlertSource = AlertSource; exports.AlertState = AlertState; exports.AlertThresholdType = AlertThresholdType; exports.ChSqlSchema = ChSqlSchema; exports.ChartAlertBaseSchema = ChartAlertBaseSchema; exports.ChartConfigSchema = ChartConfigSchema; exports.ConnectionSchema = ConnectionSchema; exports.CteChartConfigSchema = CteChartConfigSchema; exports.DashboardSchema = DashboardSchema; exports.DashboardWithoutIdSchema = DashboardWithoutIdSchema; exports.DerivedColumnSchema = DerivedColumnSchema; exports.DisplayType = DisplayType; exports.FilterSchema = FilterSchema; exports.LimitSchema = LimitSchema; exports.MetricTableSchema = MetricTableSchema; exports.MetricsDataType = MetricsDataType; exports.NumberFormatSchema = NumberFormatSchema; exports.RootValueExpressionSchema = RootValueExpressionSchema; exports.SQLIntervalSchema = SQLIntervalSchema; exports.SavedChartConfigSchema = SavedChartConfigSchema; exports.SavedSearchSchema = SavedSearchSchema; exports.SearchConditionLanguageSchema = SearchConditionLanguageSchema; exports.SearchConditionSchema = SearchConditionSchema; exports.SelectListSchema = SelectListSchema; exports.SelectSQLStatementSchema = SelectSQLStatementSchema; exports.SortSpecificationListSchema = SortSpecificationListSchema; exports.SortSpecificationSchema = SortSpecificationSchema; exports.SourceKind = SourceKind; exports.SourceSchema = SourceSchema; exports.SqlAstFilterSchema = SqlAstFilterSchema; exports.TileSchema = TileSchema; exports.WebhookService = WebhookService; exports._ChartConfigSchema = _ChartConfigSchema; exports.sourceSchemaWithout = sourceSchemaWithout; exports.zAlertChannel = zAlertChannel; exports.zAlertChannelType = zAlertChannelType; exports.zSavedSearchAlert = zSavedSearchAlert; exports.zTileAlert = zTileAlert;
