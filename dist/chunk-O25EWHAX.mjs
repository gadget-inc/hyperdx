// src/types.ts
import { z } from "zod";
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
var MetricTableSchema = z.object(
  Object.values(MetricsDataType).reduce(
    (acc, key) => ({
      ...acc,
      [key]: z.string().optional()
    }),
    {}
  )
).refine(
  (tables) => Object.values(tables).some((table) => table && table.length > 0),
  { message: "At least one metric table must be specified" }
);
var SQLIntervalSchema = z.string().regex(/^\d+ (second|minute|hour|day)$/);
var SearchConditionSchema = z.string();
var SearchConditionLanguageSchema = z.enum(["sql", "lucene"]).optional();
var AggregateFunctionSchema = z.enum([
  "avg",
  "count",
  "count_distinct",
  "last_value",
  "max",
  "min",
  "quantile",
  "sum"
]);
var AggregateFunctionWithCombinatorsSchema = z.string().regex(/^(\w+)If(State|Merge)$/);
var RootValueExpressionSchema = z.object({
  aggFn: z.union([
    AggregateFunctionSchema,
    AggregateFunctionWithCombinatorsSchema
  ]),
  aggCondition: SearchConditionSchema,
  aggConditionLanguage: SearchConditionLanguageSchema,
  valueExpression: z.string()
}).or(
  z.object({
    aggFn: z.literal("quantile"),
    level: z.number(),
    aggCondition: SearchConditionSchema,
    aggConditionLanguage: SearchConditionLanguageSchema,
    valueExpression: z.string()
  })
).or(
  z.object({
    aggFn: z.string().optional(),
    aggCondition: z.string().optional(),
    aggConditionLanguage: SearchConditionLanguageSchema,
    valueExpression: z.string(),
    metricType: z.nativeEnum(MetricsDataType).optional()
  })
);
var DerivedColumnSchema = z.intersection(
  RootValueExpressionSchema,
  z.object({
    alias: z.string().optional(),
    metricType: z.nativeEnum(MetricsDataType).optional(),
    metricName: z.string().optional()
  })
);
var SelectListSchema = z.array(DerivedColumnSchema).or(z.string());
var SortSpecificationSchema = z.intersection(
  RootValueExpressionSchema,
  z.object({
    ordering: z.enum(["ASC", "DESC"])
  })
);
var SortSpecificationListSchema = z.array(SortSpecificationSchema).or(z.string());
var LimitSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional()
});
var ChSqlSchema = z.object({
  sql: z.string(),
  params: z.record(z.string(), z.any())
});
var SelectSQLStatementSchema = z.object({
  select: SelectListSchema,
  from: z.object({
    databaseName: z.string(),
    tableName: z.string()
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
var AlertIntervalSchema = z.union([
  z.literal("1m"),
  z.literal("5m"),
  z.literal("15m"),
  z.literal("30m"),
  z.literal("1h"),
  z.literal("6h"),
  z.literal("12h"),
  z.literal("1d")
]);
var zAlertChannelType = z.literal("webhook");
var zAlertChannel = z.object({
  type: zAlertChannelType,
  webhookId: z.string().nonempty("Webhook ID can't be empty")
});
var zSavedSearchAlert = z.object({
  source: z.literal("saved_search" /* SAVED_SEARCH */),
  groupBy: z.string().optional(),
  savedSearchId: z.string().min(1)
});
var zTileAlert = z.object({
  source: z.literal("tile" /* TILE */),
  tileId: z.string().min(1),
  dashboardId: z.string().min(1)
});
var AlertBaseSchema = z.object({
  id: z.string().optional(),
  interval: AlertIntervalSchema,
  threshold: z.number().int().min(1),
  thresholdType: z.nativeEnum(AlertThresholdType),
  channel: zAlertChannel,
  state: z.nativeEnum(AlertState).optional(),
  name: z.string().min(1).max(512).nullish(),
  message: z.string().min(1).max(4096).nullish(),
  silenced: z.object({
    by: z.string(),
    at: z.string(),
    until: z.string()
  }).optional()
});
var ChartAlertBaseSchema = AlertBaseSchema.extend({
  threshold: z.number().positive()
});
var AlertSchema = z.union([
  z.intersection(AlertBaseSchema, zSavedSearchAlert),
  z.intersection(ChartAlertBaseSchema, zTileAlert)
]);
var SavedSearchSchema = z.object({
  id: z.string(),
  name: z.string(),
  select: z.string(),
  where: z.string(),
  whereLanguage: SearchConditionLanguageSchema,
  source: z.string(),
  tags: z.array(z.string()),
  orderBy: z.string().optional(),
  alerts: z.array(AlertSchema).optional()
});
var NumberFormatSchema = z.object({
  output: z.enum(["currency", "percent", "byte", "time", "number"]),
  mantissa: z.number().optional(),
  thousandSeparated: z.boolean().optional(),
  average: z.boolean().optional(),
  decimalBytes: z.boolean().optional(),
  factor: z.number().optional(),
  currencySymbol: z.string().optional(),
  unit: z.string().optional()
});
var SqlAstFilterSchema = z.object({
  type: z.literal("sql_ast"),
  operator: z.enum(["=", "<", ">", "!=", "<=", ">="]),
  left: z.string(),
  right: z.string()
});
var FilterSchema = z.union([
  z.object({
    type: z.enum(["lucene", "sql"]),
    condition: z.string()
  }),
  SqlAstFilterSchema
]);
var _ChartConfigSchema = z.object({
  displayType: z.nativeEnum(DisplayType).optional(),
  numberFormat: NumberFormatSchema.optional(),
  timestampValueExpression: z.string(),
  implicitColumnExpression: z.string().optional(),
  fallbackAttributeExpression: z.string().optional(),
  columnAliases: z.record(z.string(), z.string()).optional(),
  granularity: z.union([SQLIntervalSchema, z.literal("auto")]).optional(),
  markdown: z.string().optional(),
  filtersLogicalOperator: z.enum(["AND", "OR"]).optional(),
  filters: z.array(FilterSchema).optional(),
  connection: z.string(),
  fillNulls: z.union([z.number(), z.literal(false)]).optional(),
  selectGroupBy: z.boolean().optional(),
  metricTables: MetricTableSchema.optional(),
  seriesReturnType: z.enum(["ratio", "column"]).optional(),
  caseSensitive: z.boolean().optional()
});
var CteChartConfigSchema = z.intersection(
  _ChartConfigSchema.partial({ timestampValueExpression: true }),
  SelectSQLStatementSchema
);
var ChartConfigSchema = z.intersection(
  z.intersection(_ChartConfigSchema, SelectSQLStatementSchema),
  z.object({
    with: z.array(
      z.object({
        name: z.string(),
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
        isSubquery: z.boolean().optional()
      })
    )
  }).partial()
);
var SavedChartConfigSchema = z.intersection(
  z.intersection(
    z.object({
      name: z.string(),
      source: z.string(),
      alert: z.union([
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
var TileSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  config: SavedChartConfigSchema
});
var DashboardSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  tiles: z.array(TileSchema),
  tags: z.array(z.string())
});
var DashboardWithoutIdSchema = DashboardSchema.omit({ id: true });
var ConnectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  host: z.string(),
  username: z.string(),
  password: z.string().optional()
});
var SourceKind = /* @__PURE__ */ ((SourceKind2) => {
  SourceKind2["Log"] = "log";
  SourceKind2["Trace"] = "trace";
  SourceKind2["Session"] = "session";
  SourceKind2["Metric"] = "metric";
  return SourceKind2;
})(SourceKind || {});
var SourceBaseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  kind: z.nativeEnum(SourceKind),
  connection: z.string().min(1, "Server Connection is required"),
  from: z.object({
    databaseName: z.string().min(1, "Database is required"),
    tableName: z.string().min(1, "Table is required")
  }),
  timestampValueExpression: z.string().min(1, "Timestamp Column is required")
});
var LogSourceAugmentation = {
  kind: z.literal("log" /* Log */),
  defaultTableSelectExpression: z.string({
    message: "Default Table Select Expression is required"
  }),
  // Optional fields for logs
  serviceNameExpression: z.string().optional(),
  severityTextExpression: z.string().optional(),
  bodyExpression: z.string().optional(),
  eventAttributesExpression: z.string().optional(),
  resourceAttributesExpression: z.string().optional(),
  displayedTimestampValueExpression: z.string().optional(),
  metricSourceId: z.string().optional(),
  traceSourceId: z.string().optional(),
  traceIdExpression: z.string().optional(),
  spanIdExpression: z.string().optional(),
  implicitColumnExpression: z.string().optional(),
  uniqueRowIdExpression: z.string().optional(),
  tableFilterExpression: z.string().optional()
};
var TraceSourceAugmentation = {
  kind: z.literal("trace" /* Trace */),
  defaultTableSelectExpression: z.string().optional(),
  // Required fields for traces
  durationExpression: z.string().min(1, "Duration Expression is required"),
  durationPrecision: z.number().min(0).max(9).default(3),
  traceIdExpression: z.string().min(1, "Trace ID Expression is required"),
  spanIdExpression: z.string().min(1, "Span ID Expression is required"),
  parentSpanIdExpression: z.string().min(1, "Parent span ID expression is required"),
  spanNameExpression: z.string().min(1, "Span Name Expression is required"),
  spanKindExpression: z.string().min(1, "Span Kind Expression is required"),
  // Optional fields for traces
  logSourceId: z.string().optional().nullable(),
  sessionSourceId: z.string().optional(),
  metricSourceId: z.string().optional(),
  statusCodeExpression: z.string().optional(),
  statusMessageExpression: z.string().optional(),
  serviceNameExpression: z.string().optional(),
  resourceAttributesExpression: z.string().optional(),
  eventAttributesExpression: z.string().optional(),
  spanEventsValueExpression: z.string().optional(),
  implicitColumnExpression: z.string().optional()
};
var SessionSourceAugmentation = {
  kind: z.literal("session" /* Session */),
  // Required fields for sessions
  eventAttributesExpression: z.string().min(1, "Log Attributes Expression is required"),
  resourceAttributesExpression: z.string().min(1, "Resource Attributes Expression is required"),
  traceSourceId: z.string({ message: "Correlated Trace Source is required" }).min(1, "Correlated Trace Source is required"),
  // Optional fields for sessions
  implicitColumnExpression: z.string().optional()
};
var MetricSourceAugmentation = {
  kind: z.literal("metric" /* Metric */),
  // override from SourceBaseSchema
  from: z.object({
    databaseName: z.string().min(1, "Database is required"),
    tableName: z.string()
  }),
  // Metric tables - at least one should be provided
  metricTables: MetricTableSchema,
  resourceAttributesExpression: z.string().min(1, "Resource Attributes is required"),
  // Optional fields for metrics
  logSourceId: z.string().optional()
};
var SourceSchema = z.discriminatedUnion("kind", [
  SourceBaseSchema.extend(LogSourceAugmentation),
  SourceBaseSchema.extend(TraceSourceAugmentation),
  SourceBaseSchema.extend(SessionSourceAugmentation),
  SourceBaseSchema.extend(MetricSourceAugmentation)
]);
function sourceSchemaWithout(omissions = {}) {
  return z.discriminatedUnion("kind", [
    SourceBaseSchema.omit(omissions).extend(LogSourceAugmentation),
    SourceBaseSchema.omit(omissions).extend(TraceSourceAugmentation),
    SourceBaseSchema.omit(omissions).extend(SessionSourceAugmentation),
    SourceBaseSchema.omit(omissions).extend(MetricSourceAugmentation)
  ]);
}

export {
  MetricsDataType,
  DisplayType,
  MetricTableSchema,
  SQLIntervalSchema,
  SearchConditionSchema,
  SearchConditionLanguageSchema,
  AggregateFunctionSchema,
  AggregateFunctionWithCombinatorsSchema,
  RootValueExpressionSchema,
  DerivedColumnSchema,
  SelectListSchema,
  SortSpecificationSchema,
  SortSpecificationListSchema,
  LimitSchema,
  ChSqlSchema,
  SelectSQLStatementSchema,
  WebhookService,
  AlertThresholdType,
  AlertState,
  AlertSource,
  AlertIntervalSchema,
  zAlertChannelType,
  zAlertChannel,
  zSavedSearchAlert,
  zTileAlert,
  AlertBaseSchema,
  ChartAlertBaseSchema,
  AlertSchema,
  SavedSearchSchema,
  NumberFormatSchema,
  SqlAstFilterSchema,
  FilterSchema,
  _ChartConfigSchema,
  CteChartConfigSchema,
  ChartConfigSchema,
  SavedChartConfigSchema,
  TileSchema,
  DashboardSchema,
  DashboardWithoutIdSchema,
  ConnectionSchema,
  SourceKind,
  SourceSchema,
  sourceSchemaWithout
};
