import { z } from 'zod';

declare enum MetricsDataType {
    Gauge = "gauge",
    Histogram = "histogram",
    Sum = "sum",
    Summary = "summary",
    ExponentialHistogram = "exponential histogram"
}
declare enum DisplayType {
    Line = "line",
    StackedBar = "stacked_bar",
    Table = "table",
    Number = "number",
    Search = "search",
    Heatmap = "heatmap",
    Markdown = "markdown"
}
type KeyValue<Key = string, Value = string> = {
    key: Key;
    value: Value;
};
declare const MetricTableSchema: z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
    gauge: string;
    histogram: string;
    sum: string;
    summary: string;
    "exponential histogram": string;
}, {
    gauge: string;
    histogram: string;
    sum: string;
    summary: string;
    "exponential histogram": string;
}>, {
    gauge: string;
    histogram: string;
    sum: string;
    summary: string;
    "exponential histogram": string;
}, {
    gauge: string;
    histogram: string;
    sum: string;
    summary: string;
    "exponential histogram": string;
}>;
type MetricTable = z.infer<typeof MetricTableSchema>;
declare const SQLIntervalSchema: z.ZodString;
declare const SearchConditionSchema: z.ZodString;
declare const SearchConditionLanguageSchema: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
declare const AggregateFunctionSchema: z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>;
declare const AggregateFunctionWithCombinatorsSchema: z.ZodString;
declare const RootValueExpressionSchema: z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
    aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
    aggCondition: z.ZodString;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aggFn: string;
    aggCondition: string;
    valueExpression: string;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}, {
    aggFn: string;
    aggCondition: string;
    valueExpression: string;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}>, z.ZodObject<{
    aggFn: z.ZodLiteral<"quantile">;
    level: z.ZodNumber;
    aggCondition: z.ZodString;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aggFn: "quantile";
    aggCondition: string;
    valueExpression: string;
    level: number;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}, {
    aggFn: "quantile";
    aggCondition: string;
    valueExpression: string;
    level: number;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}>]>, z.ZodObject<{
    aggFn: z.ZodOptional<z.ZodString>;
    aggCondition: z.ZodOptional<z.ZodString>;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
    metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
}, "strip", z.ZodTypeAny, {
    valueExpression: string;
    aggFn?: string | undefined;
    aggCondition?: string | undefined;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
    metricType?: MetricsDataType | undefined;
}, {
    valueExpression: string;
    aggFn?: string | undefined;
    aggCondition?: string | undefined;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
    metricType?: MetricsDataType | undefined;
}>]>;
declare const DerivedColumnSchema: z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
    aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
    aggCondition: z.ZodString;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aggFn: string;
    aggCondition: string;
    valueExpression: string;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}, {
    aggFn: string;
    aggCondition: string;
    valueExpression: string;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}>, z.ZodObject<{
    aggFn: z.ZodLiteral<"quantile">;
    level: z.ZodNumber;
    aggCondition: z.ZodString;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aggFn: "quantile";
    aggCondition: string;
    valueExpression: string;
    level: number;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}, {
    aggFn: "quantile";
    aggCondition: string;
    valueExpression: string;
    level: number;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}>]>, z.ZodObject<{
    aggFn: z.ZodOptional<z.ZodString>;
    aggCondition: z.ZodOptional<z.ZodString>;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
    metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
}, "strip", z.ZodTypeAny, {
    valueExpression: string;
    aggFn?: string | undefined;
    aggCondition?: string | undefined;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
    metricType?: MetricsDataType | undefined;
}, {
    valueExpression: string;
    aggFn?: string | undefined;
    aggCondition?: string | undefined;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
    metricType?: MetricsDataType | undefined;
}>]>, z.ZodObject<{
    alias: z.ZodOptional<z.ZodString>;
    metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    metricName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    metricName?: string | undefined;
    metricType?: MetricsDataType | undefined;
    alias?: string | undefined;
}, {
    metricName?: string | undefined;
    metricType?: MetricsDataType | undefined;
    alias?: string | undefined;
}>>;
declare const SelectListSchema: z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
    aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
    aggCondition: z.ZodString;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aggFn: string;
    aggCondition: string;
    valueExpression: string;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}, {
    aggFn: string;
    aggCondition: string;
    valueExpression: string;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}>, z.ZodObject<{
    aggFn: z.ZodLiteral<"quantile">;
    level: z.ZodNumber;
    aggCondition: z.ZodString;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aggFn: "quantile";
    aggCondition: string;
    valueExpression: string;
    level: number;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}, {
    aggFn: "quantile";
    aggCondition: string;
    valueExpression: string;
    level: number;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}>]>, z.ZodObject<{
    aggFn: z.ZodOptional<z.ZodString>;
    aggCondition: z.ZodOptional<z.ZodString>;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
    metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
}, "strip", z.ZodTypeAny, {
    valueExpression: string;
    aggFn?: string | undefined;
    aggCondition?: string | undefined;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
    metricType?: MetricsDataType | undefined;
}, {
    valueExpression: string;
    aggFn?: string | undefined;
    aggCondition?: string | undefined;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
    metricType?: MetricsDataType | undefined;
}>]>, z.ZodObject<{
    alias: z.ZodOptional<z.ZodString>;
    metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    metricName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    metricName?: string | undefined;
    metricType?: MetricsDataType | undefined;
    alias?: string | undefined;
}, {
    metricName?: string | undefined;
    metricType?: MetricsDataType | undefined;
    alias?: string | undefined;
}>>, "many">, z.ZodString]>;
declare const SortSpecificationSchema: z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
    aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
    aggCondition: z.ZodString;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aggFn: string;
    aggCondition: string;
    valueExpression: string;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}, {
    aggFn: string;
    aggCondition: string;
    valueExpression: string;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}>, z.ZodObject<{
    aggFn: z.ZodLiteral<"quantile">;
    level: z.ZodNumber;
    aggCondition: z.ZodString;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aggFn: "quantile";
    aggCondition: string;
    valueExpression: string;
    level: number;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}, {
    aggFn: "quantile";
    aggCondition: string;
    valueExpression: string;
    level: number;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}>]>, z.ZodObject<{
    aggFn: z.ZodOptional<z.ZodString>;
    aggCondition: z.ZodOptional<z.ZodString>;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
    metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
}, "strip", z.ZodTypeAny, {
    valueExpression: string;
    aggFn?: string | undefined;
    aggCondition?: string | undefined;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
    metricType?: MetricsDataType | undefined;
}, {
    valueExpression: string;
    aggFn?: string | undefined;
    aggCondition?: string | undefined;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
    metricType?: MetricsDataType | undefined;
}>]>, z.ZodObject<{
    ordering: z.ZodEnum<["ASC", "DESC"]>;
}, "strip", z.ZodTypeAny, {
    ordering: "ASC" | "DESC";
}, {
    ordering: "ASC" | "DESC";
}>>;
declare const SortSpecificationListSchema: z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
    aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
    aggCondition: z.ZodString;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aggFn: string;
    aggCondition: string;
    valueExpression: string;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}, {
    aggFn: string;
    aggCondition: string;
    valueExpression: string;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}>, z.ZodObject<{
    aggFn: z.ZodLiteral<"quantile">;
    level: z.ZodNumber;
    aggCondition: z.ZodString;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aggFn: "quantile";
    aggCondition: string;
    valueExpression: string;
    level: number;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}, {
    aggFn: "quantile";
    aggCondition: string;
    valueExpression: string;
    level: number;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
}>]>, z.ZodObject<{
    aggFn: z.ZodOptional<z.ZodString>;
    aggCondition: z.ZodOptional<z.ZodString>;
    aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    valueExpression: z.ZodString;
    metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
}, "strip", z.ZodTypeAny, {
    valueExpression: string;
    aggFn?: string | undefined;
    aggCondition?: string | undefined;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
    metricType?: MetricsDataType | undefined;
}, {
    valueExpression: string;
    aggFn?: string | undefined;
    aggCondition?: string | undefined;
    aggConditionLanguage?: "sql" | "lucene" | undefined;
    metricType?: MetricsDataType | undefined;
}>]>, z.ZodObject<{
    ordering: z.ZodEnum<["ASC", "DESC"]>;
}, "strip", z.ZodTypeAny, {
    ordering: "ASC" | "DESC";
}, {
    ordering: "ASC" | "DESC";
}>>, "many">, z.ZodString]>;
declare const LimitSchema: z.ZodObject<{
    limit: z.ZodOptional<z.ZodNumber>;
    offset: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    offset?: number | undefined;
}, {
    limit?: number | undefined;
    offset?: number | undefined;
}>;
declare const ChSqlSchema: z.ZodObject<{
    sql: z.ZodString;
    params: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    sql: string;
    params: Record<string, any>;
}, {
    sql: string;
    params: Record<string, any>;
}>;
declare const SelectSQLStatementSchema: z.ZodObject<{
    select: z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        metricName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }>>, "many">, z.ZodString]>;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    where: z.ZodString;
    whereLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    groupBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        metricName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }>>, "many">, z.ZodString]>>;
    having: z.ZodOptional<z.ZodString>;
    havingLanguage: z.ZodOptional<z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>>;
    orderBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        ordering: z.ZodEnum<["ASC", "DESC"]>;
    }, "strip", z.ZodTypeAny, {
        ordering: "ASC" | "DESC";
    }, {
        ordering: "ASC" | "DESC";
    }>>, "many">, z.ZodString]>>;
    limit: z.ZodOptional<z.ZodObject<{
        limit: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit?: number | undefined;
        offset?: number | undefined;
    }, {
        limit?: number | undefined;
        offset?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    select: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[];
    from: {
        databaseName: string;
        tableName: string;
    };
    where: string;
    limit?: {
        limit?: number | undefined;
        offset?: number | undefined;
    } | undefined;
    whereLanguage?: "sql" | "lucene" | undefined;
    groupBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[] | undefined;
    having?: string | undefined;
    havingLanguage?: "sql" | "lucene" | undefined;
    orderBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        ordering: "ASC" | "DESC";
    })[] | undefined;
}, {
    select: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[];
    from: {
        databaseName: string;
        tableName: string;
    };
    where: string;
    limit?: {
        limit?: number | undefined;
        offset?: number | undefined;
    } | undefined;
    whereLanguage?: "sql" | "lucene" | undefined;
    groupBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[] | undefined;
    having?: string | undefined;
    havingLanguage?: "sql" | "lucene" | undefined;
    orderBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        ordering: "ASC" | "DESC";
    })[] | undefined;
}>;
type SQLInterval = z.infer<typeof SQLIntervalSchema>;
type SearchCondition = z.infer<typeof SearchConditionSchema>;
type SearchConditionLanguage = z.infer<typeof SearchConditionLanguageSchema>;
type AggregateFunction = z.infer<typeof AggregateFunctionSchema>;
type AggregateFunctionWithCombinators = z.infer<typeof AggregateFunctionWithCombinatorsSchema>;
type DerivedColumn = z.infer<typeof DerivedColumnSchema>;
type SelectList = z.infer<typeof SelectListSchema>;
type SortSpecificationList = z.infer<typeof SortSpecificationListSchema>;
type Limit = {
    limit?: number;
    offset?: number;
};
type SelectSQLStatement = {
    select: SelectList;
    from: {
        databaseName: string;
        tableName: string;
    };
    where: SearchCondition;
    whereLanguage?: SearchConditionLanguage;
    groupBy?: SelectList;
    having?: SearchCondition;
    havingLanguage?: SearchConditionLanguage;
    orderBy?: SortSpecificationList;
    limit?: Limit;
};
type StacktraceFrame = {
    filename: string;
    function: string;
    module?: string;
    lineno: number;
    colno: number;
    in_app: boolean;
    context_line?: string;
    pre_context?: string[];
    post_context?: string[];
};
type StacktraceBreadcrumbCategory = 'ui.click' | 'fetch' | 'xhr' | 'console' | 'navigation' | string;
type StacktraceBreadcrumb = {
    type?: string;
    level?: string;
    event_id?: string;
    category?: StacktraceBreadcrumbCategory;
    message?: string;
    data?: {
        [key: string]: any;
    };
    timestamp: number;
};
declare enum WebhookService {
    Slack = "slack",
    Generic = "generic"
}
declare enum AlertThresholdType {
    ABOVE = "above",
    BELOW = "below"
}
declare enum AlertState {
    ALERT = "ALERT",
    DISABLED = "DISABLED",
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA",
    OK = "OK"
}
declare enum AlertSource {
    SAVED_SEARCH = "saved_search",
    TILE = "tile"
}
declare const AlertIntervalSchema: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
type AlertInterval = z.infer<typeof AlertIntervalSchema>;
declare const zAlertChannelType: z.ZodLiteral<"webhook">;
type AlertChannelType = z.infer<typeof zAlertChannelType>;
declare const zAlertChannel: z.ZodObject<{
    type: z.ZodLiteral<"webhook">;
    webhookId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "webhook";
    webhookId: string;
}, {
    type: "webhook";
    webhookId: string;
}>;
declare const zSavedSearchAlert: z.ZodObject<{
    source: z.ZodLiteral<AlertSource.SAVED_SEARCH>;
    groupBy: z.ZodOptional<z.ZodString>;
    savedSearchId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    source: AlertSource.SAVED_SEARCH;
    savedSearchId: string;
    groupBy?: string | undefined;
}, {
    source: AlertSource.SAVED_SEARCH;
    savedSearchId: string;
    groupBy?: string | undefined;
}>;
declare const zTileAlert: z.ZodObject<{
    source: z.ZodLiteral<AlertSource.TILE>;
    tileId: z.ZodString;
    dashboardId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    source: AlertSource.TILE;
    tileId: string;
    dashboardId: string;
}, {
    source: AlertSource.TILE;
    tileId: string;
    dashboardId: string;
}>;
declare const AlertBaseSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
    threshold: z.ZodNumber;
    thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
    channel: z.ZodObject<{
        type: z.ZodLiteral<"webhook">;
        webhookId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "webhook";
        webhookId: string;
    }, {
        type: "webhook";
        webhookId: string;
    }>;
    state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    silenced: z.ZodOptional<z.ZodObject<{
        by: z.ZodString;
        at: z.ZodString;
        until: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        at: string;
        by: string;
        until: string;
    }, {
        at: string;
        by: string;
        until: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
    threshold: number;
    thresholdType: AlertThresholdType;
    channel: {
        type: "webhook";
        webhookId: string;
    };
    message?: string | null | undefined;
    name?: string | null | undefined;
    id?: string | undefined;
    state?: AlertState | undefined;
    silenced?: {
        at: string;
        by: string;
        until: string;
    } | undefined;
}, {
    interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
    threshold: number;
    thresholdType: AlertThresholdType;
    channel: {
        type: "webhook";
        webhookId: string;
    };
    message?: string | null | undefined;
    name?: string | null | undefined;
    id?: string | undefined;
    state?: AlertState | undefined;
    silenced?: {
        at: string;
        by: string;
        until: string;
    } | undefined;
}>;
declare const ChartAlertBaseSchema: z.ZodObject<z.objectUtil.extendShape<{
    id: z.ZodOptional<z.ZodString>;
    interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
    threshold: z.ZodNumber;
    thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
    channel: z.ZodObject<{
        type: z.ZodLiteral<"webhook">;
        webhookId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "webhook";
        webhookId: string;
    }, {
        type: "webhook";
        webhookId: string;
    }>;
    state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    silenced: z.ZodOptional<z.ZodObject<{
        by: z.ZodString;
        at: z.ZodString;
        until: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        at: string;
        by: string;
        until: string;
    }, {
        at: string;
        by: string;
        until: string;
    }>>;
}, {
    threshold: z.ZodNumber;
}>, "strip", z.ZodTypeAny, {
    interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
    threshold: number;
    thresholdType: AlertThresholdType;
    channel: {
        type: "webhook";
        webhookId: string;
    };
    message?: string | null | undefined;
    name?: string | null | undefined;
    id?: string | undefined;
    state?: AlertState | undefined;
    silenced?: {
        at: string;
        by: string;
        until: string;
    } | undefined;
}, {
    interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
    threshold: number;
    thresholdType: AlertThresholdType;
    channel: {
        type: "webhook";
        webhookId: string;
    };
    message?: string | null | undefined;
    name?: string | null | undefined;
    id?: string | undefined;
    state?: AlertState | undefined;
    silenced?: {
        at: string;
        by: string;
        until: string;
    } | undefined;
}>;
declare const AlertSchema: z.ZodUnion<[z.ZodIntersection<z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
    threshold: z.ZodNumber;
    thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
    channel: z.ZodObject<{
        type: z.ZodLiteral<"webhook">;
        webhookId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "webhook";
        webhookId: string;
    }, {
        type: "webhook";
        webhookId: string;
    }>;
    state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    silenced: z.ZodOptional<z.ZodObject<{
        by: z.ZodString;
        at: z.ZodString;
        until: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        at: string;
        by: string;
        until: string;
    }, {
        at: string;
        by: string;
        until: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
    threshold: number;
    thresholdType: AlertThresholdType;
    channel: {
        type: "webhook";
        webhookId: string;
    };
    message?: string | null | undefined;
    name?: string | null | undefined;
    id?: string | undefined;
    state?: AlertState | undefined;
    silenced?: {
        at: string;
        by: string;
        until: string;
    } | undefined;
}, {
    interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
    threshold: number;
    thresholdType: AlertThresholdType;
    channel: {
        type: "webhook";
        webhookId: string;
    };
    message?: string | null | undefined;
    name?: string | null | undefined;
    id?: string | undefined;
    state?: AlertState | undefined;
    silenced?: {
        at: string;
        by: string;
        until: string;
    } | undefined;
}>, z.ZodObject<{
    source: z.ZodLiteral<AlertSource.SAVED_SEARCH>;
    groupBy: z.ZodOptional<z.ZodString>;
    savedSearchId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    source: AlertSource.SAVED_SEARCH;
    savedSearchId: string;
    groupBy?: string | undefined;
}, {
    source: AlertSource.SAVED_SEARCH;
    savedSearchId: string;
    groupBy?: string | undefined;
}>>, z.ZodIntersection<z.ZodObject<z.objectUtil.extendShape<{
    id: z.ZodOptional<z.ZodString>;
    interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
    threshold: z.ZodNumber;
    thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
    channel: z.ZodObject<{
        type: z.ZodLiteral<"webhook">;
        webhookId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "webhook";
        webhookId: string;
    }, {
        type: "webhook";
        webhookId: string;
    }>;
    state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    silenced: z.ZodOptional<z.ZodObject<{
        by: z.ZodString;
        at: z.ZodString;
        until: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        at: string;
        by: string;
        until: string;
    }, {
        at: string;
        by: string;
        until: string;
    }>>;
}, {
    threshold: z.ZodNumber;
}>, "strip", z.ZodTypeAny, {
    interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
    threshold: number;
    thresholdType: AlertThresholdType;
    channel: {
        type: "webhook";
        webhookId: string;
    };
    message?: string | null | undefined;
    name?: string | null | undefined;
    id?: string | undefined;
    state?: AlertState | undefined;
    silenced?: {
        at: string;
        by: string;
        until: string;
    } | undefined;
}, {
    interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
    threshold: number;
    thresholdType: AlertThresholdType;
    channel: {
        type: "webhook";
        webhookId: string;
    };
    message?: string | null | undefined;
    name?: string | null | undefined;
    id?: string | undefined;
    state?: AlertState | undefined;
    silenced?: {
        at: string;
        by: string;
        until: string;
    } | undefined;
}>, z.ZodObject<{
    source: z.ZodLiteral<AlertSource.TILE>;
    tileId: z.ZodString;
    dashboardId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    source: AlertSource.TILE;
    tileId: string;
    dashboardId: string;
}, {
    source: AlertSource.TILE;
    tileId: string;
    dashboardId: string;
}>>]>;
type Alert = z.infer<typeof AlertSchema>;
type AlertHistory = {
    counts: number;
    createdAt: string;
    lastValues: {
        startTime: string;
        count: number;
    }[];
    state: AlertState;
};
declare const SavedSearchSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    select: z.ZodString;
    where: z.ZodString;
    whereLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    source: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
    orderBy: z.ZodOptional<z.ZodString>;
    alerts: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodIntersection<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
        threshold: z.ZodNumber;
        thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
        channel: z.ZodObject<{
            type: z.ZodLiteral<"webhook">;
            webhookId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "webhook";
            webhookId: string;
        }, {
            type: "webhook";
            webhookId: string;
        }>;
        state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
        name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        silenced: z.ZodOptional<z.ZodObject<{
            by: z.ZodString;
            at: z.ZodString;
            until: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            at: string;
            by: string;
            until: string;
        }, {
            at: string;
            by: string;
            until: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    }, {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    }>, z.ZodObject<{
        source: z.ZodLiteral<AlertSource.SAVED_SEARCH>;
        groupBy: z.ZodOptional<z.ZodString>;
        savedSearchId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        source: AlertSource.SAVED_SEARCH;
        savedSearchId: string;
        groupBy?: string | undefined;
    }, {
        source: AlertSource.SAVED_SEARCH;
        savedSearchId: string;
        groupBy?: string | undefined;
    }>>, z.ZodIntersection<z.ZodObject<z.objectUtil.extendShape<{
        id: z.ZodOptional<z.ZodString>;
        interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
        threshold: z.ZodNumber;
        thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
        channel: z.ZodObject<{
            type: z.ZodLiteral<"webhook">;
            webhookId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "webhook";
            webhookId: string;
        }, {
            type: "webhook";
            webhookId: string;
        }>;
        state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
        name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        silenced: z.ZodOptional<z.ZodObject<{
            by: z.ZodString;
            at: z.ZodString;
            until: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            at: string;
            by: string;
            until: string;
        }, {
            at: string;
            by: string;
            until: string;
        }>>;
    }, {
        threshold: z.ZodNumber;
    }>, "strip", z.ZodTypeAny, {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    }, {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    }>, z.ZodObject<{
        source: z.ZodLiteral<AlertSource.TILE>;
        tileId: z.ZodString;
        dashboardId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        source: AlertSource.TILE;
        tileId: string;
        dashboardId: string;
    }, {
        source: AlertSource.TILE;
        tileId: string;
        dashboardId: string;
    }>>]>, "many">>;
}, "strip", z.ZodTypeAny, {
    select: string;
    where: string;
    name: string;
    id: string;
    source: string;
    tags: string[];
    whereLanguage?: "sql" | "lucene" | undefined;
    orderBy?: string | undefined;
    alerts?: (({
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    } & {
        source: AlertSource.SAVED_SEARCH;
        savedSearchId: string;
        groupBy?: string | undefined;
    }) | ({
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    } & {
        source: AlertSource.TILE;
        tileId: string;
        dashboardId: string;
    }))[] | undefined;
}, {
    select: string;
    where: string;
    name: string;
    id: string;
    source: string;
    tags: string[];
    whereLanguage?: "sql" | "lucene" | undefined;
    orderBy?: string | undefined;
    alerts?: (({
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    } & {
        source: AlertSource.SAVED_SEARCH;
        savedSearchId: string;
        groupBy?: string | undefined;
    }) | ({
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    } & {
        source: AlertSource.TILE;
        tileId: string;
        dashboardId: string;
    }))[] | undefined;
}>;
type SavedSearch = z.infer<typeof SavedSearchSchema>;
declare const NumberFormatSchema: z.ZodObject<{
    output: z.ZodEnum<["currency", "percent", "byte", "time", "number"]>;
    mantissa: z.ZodOptional<z.ZodNumber>;
    thousandSeparated: z.ZodOptional<z.ZodBoolean>;
    average: z.ZodOptional<z.ZodBoolean>;
    decimalBytes: z.ZodOptional<z.ZodBoolean>;
    factor: z.ZodOptional<z.ZodNumber>;
    currencySymbol: z.ZodOptional<z.ZodString>;
    unit: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    output: "number" | "currency" | "percent" | "byte" | "time";
    mantissa?: number | undefined;
    thousandSeparated?: boolean | undefined;
    average?: boolean | undefined;
    decimalBytes?: boolean | undefined;
    factor?: number | undefined;
    currencySymbol?: string | undefined;
    unit?: string | undefined;
}, {
    output: "number" | "currency" | "percent" | "byte" | "time";
    mantissa?: number | undefined;
    thousandSeparated?: boolean | undefined;
    average?: boolean | undefined;
    decimalBytes?: boolean | undefined;
    factor?: number | undefined;
    currencySymbol?: string | undefined;
    unit?: string | undefined;
}>;
type NumberFormat = z.infer<typeof NumberFormatSchema>;
declare const SqlAstFilterSchema: z.ZodObject<{
    type: z.ZodLiteral<"sql_ast">;
    operator: z.ZodEnum<["=", "<", ">", "!=", "<=", ">="]>;
    left: z.ZodString;
    right: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "sql_ast";
    operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
    left: string;
    right: string;
}, {
    type: "sql_ast";
    operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
    left: string;
    right: string;
}>;
type SqlAstFilter = z.infer<typeof SqlAstFilterSchema>;
declare const FilterSchema: z.ZodUnion<[z.ZodObject<{
    type: z.ZodEnum<["lucene", "sql"]>;
    condition: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "sql" | "lucene";
    condition: string;
}, {
    type: "sql" | "lucene";
    condition: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"sql_ast">;
    operator: z.ZodEnum<["=", "<", ">", "!=", "<=", ">="]>;
    left: z.ZodString;
    right: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "sql_ast";
    operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
    left: string;
    right: string;
}, {
    type: "sql_ast";
    operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
    left: string;
    right: string;
}>]>;
type Filter = z.infer<typeof FilterSchema>;
declare const _ChartConfigSchema: z.ZodObject<{
    displayType: z.ZodOptional<z.ZodNativeEnum<typeof DisplayType>>;
    numberFormat: z.ZodOptional<z.ZodObject<{
        output: z.ZodEnum<["currency", "percent", "byte", "time", "number"]>;
        mantissa: z.ZodOptional<z.ZodNumber>;
        thousandSeparated: z.ZodOptional<z.ZodBoolean>;
        average: z.ZodOptional<z.ZodBoolean>;
        decimalBytes: z.ZodOptional<z.ZodBoolean>;
        factor: z.ZodOptional<z.ZodNumber>;
        currencySymbol: z.ZodOptional<z.ZodString>;
        unit: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    }, {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    }>>;
    timestampValueExpression: z.ZodString;
    implicitColumnExpression: z.ZodOptional<z.ZodString>;
    fallbackAttributeExpression: z.ZodOptional<z.ZodString>;
    columnAliases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    granularity: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"auto">]>>;
    markdown: z.ZodOptional<z.ZodString>;
    filtersLogicalOperator: z.ZodOptional<z.ZodEnum<["AND", "OR"]>>;
    filters: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodEnum<["lucene", "sql"]>;
        condition: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "sql" | "lucene";
        condition: string;
    }, {
        type: "sql" | "lucene";
        condition: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"sql_ast">;
        operator: z.ZodEnum<["=", "<", ">", "!=", "<=", ">="]>;
        left: z.ZodString;
        right: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    }, {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    }>]>, "many">>;
    connection: z.ZodString;
    fillNulls: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<false>]>>;
    selectGroupBy: z.ZodOptional<z.ZodBoolean>;
    metricTables: z.ZodOptional<z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>>;
    seriesReturnType: z.ZodOptional<z.ZodEnum<["ratio", "column"]>>;
}, "strip", z.ZodTypeAny, {
    timestampValueExpression: string;
    connection: string;
    displayType?: DisplayType | undefined;
    numberFormat?: {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    } | undefined;
    implicitColumnExpression?: string | undefined;
    fallbackAttributeExpression?: string | undefined;
    columnAliases?: Record<string, string> | undefined;
    granularity?: string | undefined;
    markdown?: string | undefined;
    filtersLogicalOperator?: "AND" | "OR" | undefined;
    filters?: ({
        type: "sql" | "lucene";
        condition: string;
    } | {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    })[] | undefined;
    fillNulls?: number | false | undefined;
    selectGroupBy?: boolean | undefined;
    metricTables?: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    } | undefined;
    seriesReturnType?: "column" | "ratio" | undefined;
}, {
    timestampValueExpression: string;
    connection: string;
    displayType?: DisplayType | undefined;
    numberFormat?: {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    } | undefined;
    implicitColumnExpression?: string | undefined;
    fallbackAttributeExpression?: string | undefined;
    columnAliases?: Record<string, string> | undefined;
    granularity?: string | undefined;
    markdown?: string | undefined;
    filtersLogicalOperator?: "AND" | "OR" | undefined;
    filters?: ({
        type: "sql" | "lucene";
        condition: string;
    } | {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    })[] | undefined;
    fillNulls?: number | false | undefined;
    selectGroupBy?: boolean | undefined;
    metricTables?: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    } | undefined;
    seriesReturnType?: "column" | "ratio" | undefined;
}>;
declare const CteChartConfigSchema: z.ZodIntersection<z.ZodObject<{
    displayType: z.ZodOptional<z.ZodNativeEnum<typeof DisplayType>>;
    numberFormat: z.ZodOptional<z.ZodObject<{
        output: z.ZodEnum<["currency", "percent", "byte", "time", "number"]>;
        mantissa: z.ZodOptional<z.ZodNumber>;
        thousandSeparated: z.ZodOptional<z.ZodBoolean>;
        average: z.ZodOptional<z.ZodBoolean>;
        decimalBytes: z.ZodOptional<z.ZodBoolean>;
        factor: z.ZodOptional<z.ZodNumber>;
        currencySymbol: z.ZodOptional<z.ZodString>;
        unit: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    }, {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    }>>;
    timestampValueExpression: z.ZodOptional<z.ZodString>;
    implicitColumnExpression: z.ZodOptional<z.ZodString>;
    fallbackAttributeExpression: z.ZodOptional<z.ZodString>;
    columnAliases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    granularity: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"auto">]>>;
    markdown: z.ZodOptional<z.ZodString>;
    filtersLogicalOperator: z.ZodOptional<z.ZodEnum<["AND", "OR"]>>;
    filters: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodEnum<["lucene", "sql"]>;
        condition: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "sql" | "lucene";
        condition: string;
    }, {
        type: "sql" | "lucene";
        condition: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"sql_ast">;
        operator: z.ZodEnum<["=", "<", ">", "!=", "<=", ">="]>;
        left: z.ZodString;
        right: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    }, {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    }>]>, "many">>;
    connection: z.ZodString;
    fillNulls: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<false>]>>;
    selectGroupBy: z.ZodOptional<z.ZodBoolean>;
    metricTables: z.ZodOptional<z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>>;
    seriesReturnType: z.ZodOptional<z.ZodEnum<["ratio", "column"]>>;
}, "strip", z.ZodTypeAny, {
    connection: string;
    displayType?: DisplayType | undefined;
    numberFormat?: {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    } | undefined;
    timestampValueExpression?: string | undefined;
    implicitColumnExpression?: string | undefined;
    fallbackAttributeExpression?: string | undefined;
    columnAliases?: Record<string, string> | undefined;
    granularity?: string | undefined;
    markdown?: string | undefined;
    filtersLogicalOperator?: "AND" | "OR" | undefined;
    filters?: ({
        type: "sql" | "lucene";
        condition: string;
    } | {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    })[] | undefined;
    fillNulls?: number | false | undefined;
    selectGroupBy?: boolean | undefined;
    metricTables?: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    } | undefined;
    seriesReturnType?: "column" | "ratio" | undefined;
}, {
    connection: string;
    displayType?: DisplayType | undefined;
    numberFormat?: {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    } | undefined;
    timestampValueExpression?: string | undefined;
    implicitColumnExpression?: string | undefined;
    fallbackAttributeExpression?: string | undefined;
    columnAliases?: Record<string, string> | undefined;
    granularity?: string | undefined;
    markdown?: string | undefined;
    filtersLogicalOperator?: "AND" | "OR" | undefined;
    filters?: ({
        type: "sql" | "lucene";
        condition: string;
    } | {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    })[] | undefined;
    fillNulls?: number | false | undefined;
    selectGroupBy?: boolean | undefined;
    metricTables?: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    } | undefined;
    seriesReturnType?: "column" | "ratio" | undefined;
}>, z.ZodObject<{
    select: z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        metricName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }>>, "many">, z.ZodString]>;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    where: z.ZodString;
    whereLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    groupBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        metricName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }>>, "many">, z.ZodString]>>;
    having: z.ZodOptional<z.ZodString>;
    havingLanguage: z.ZodOptional<z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>>;
    orderBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        ordering: z.ZodEnum<["ASC", "DESC"]>;
    }, "strip", z.ZodTypeAny, {
        ordering: "ASC" | "DESC";
    }, {
        ordering: "ASC" | "DESC";
    }>>, "many">, z.ZodString]>>;
    limit: z.ZodOptional<z.ZodObject<{
        limit: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit?: number | undefined;
        offset?: number | undefined;
    }, {
        limit?: number | undefined;
        offset?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    select: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[];
    from: {
        databaseName: string;
        tableName: string;
    };
    where: string;
    limit?: {
        limit?: number | undefined;
        offset?: number | undefined;
    } | undefined;
    whereLanguage?: "sql" | "lucene" | undefined;
    groupBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[] | undefined;
    having?: string | undefined;
    havingLanguage?: "sql" | "lucene" | undefined;
    orderBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        ordering: "ASC" | "DESC";
    })[] | undefined;
}, {
    select: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[];
    from: {
        databaseName: string;
        tableName: string;
    };
    where: string;
    limit?: {
        limit?: number | undefined;
        offset?: number | undefined;
    } | undefined;
    whereLanguage?: "sql" | "lucene" | undefined;
    groupBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[] | undefined;
    having?: string | undefined;
    havingLanguage?: "sql" | "lucene" | undefined;
    orderBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        ordering: "ASC" | "DESC";
    })[] | undefined;
}>>;
type CteChartConfig = z.infer<typeof CteChartConfigSchema>;
declare const ChartConfigSchema: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
    displayType: z.ZodOptional<z.ZodNativeEnum<typeof DisplayType>>;
    numberFormat: z.ZodOptional<z.ZodObject<{
        output: z.ZodEnum<["currency", "percent", "byte", "time", "number"]>;
        mantissa: z.ZodOptional<z.ZodNumber>;
        thousandSeparated: z.ZodOptional<z.ZodBoolean>;
        average: z.ZodOptional<z.ZodBoolean>;
        decimalBytes: z.ZodOptional<z.ZodBoolean>;
        factor: z.ZodOptional<z.ZodNumber>;
        currencySymbol: z.ZodOptional<z.ZodString>;
        unit: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    }, {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    }>>;
    timestampValueExpression: z.ZodString;
    implicitColumnExpression: z.ZodOptional<z.ZodString>;
    fallbackAttributeExpression: z.ZodOptional<z.ZodString>;
    columnAliases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    granularity: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"auto">]>>;
    markdown: z.ZodOptional<z.ZodString>;
    filtersLogicalOperator: z.ZodOptional<z.ZodEnum<["AND", "OR"]>>;
    filters: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodEnum<["lucene", "sql"]>;
        condition: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "sql" | "lucene";
        condition: string;
    }, {
        type: "sql" | "lucene";
        condition: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"sql_ast">;
        operator: z.ZodEnum<["=", "<", ">", "!=", "<=", ">="]>;
        left: z.ZodString;
        right: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    }, {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    }>]>, "many">>;
    connection: z.ZodString;
    fillNulls: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<false>]>>;
    selectGroupBy: z.ZodOptional<z.ZodBoolean>;
    metricTables: z.ZodOptional<z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>>;
    seriesReturnType: z.ZodOptional<z.ZodEnum<["ratio", "column"]>>;
}, "strip", z.ZodTypeAny, {
    timestampValueExpression: string;
    connection: string;
    displayType?: DisplayType | undefined;
    numberFormat?: {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    } | undefined;
    implicitColumnExpression?: string | undefined;
    fallbackAttributeExpression?: string | undefined;
    columnAliases?: Record<string, string> | undefined;
    granularity?: string | undefined;
    markdown?: string | undefined;
    filtersLogicalOperator?: "AND" | "OR" | undefined;
    filters?: ({
        type: "sql" | "lucene";
        condition: string;
    } | {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    })[] | undefined;
    fillNulls?: number | false | undefined;
    selectGroupBy?: boolean | undefined;
    metricTables?: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    } | undefined;
    seriesReturnType?: "column" | "ratio" | undefined;
}, {
    timestampValueExpression: string;
    connection: string;
    displayType?: DisplayType | undefined;
    numberFormat?: {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    } | undefined;
    implicitColumnExpression?: string | undefined;
    fallbackAttributeExpression?: string | undefined;
    columnAliases?: Record<string, string> | undefined;
    granularity?: string | undefined;
    markdown?: string | undefined;
    filtersLogicalOperator?: "AND" | "OR" | undefined;
    filters?: ({
        type: "sql" | "lucene";
        condition: string;
    } | {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    })[] | undefined;
    fillNulls?: number | false | undefined;
    selectGroupBy?: boolean | undefined;
    metricTables?: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    } | undefined;
    seriesReturnType?: "column" | "ratio" | undefined;
}>, z.ZodObject<{
    select: z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        metricName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }>>, "many">, z.ZodString]>;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    where: z.ZodString;
    whereLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    groupBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        metricName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }>>, "many">, z.ZodString]>>;
    having: z.ZodOptional<z.ZodString>;
    havingLanguage: z.ZodOptional<z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>>;
    orderBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        ordering: z.ZodEnum<["ASC", "DESC"]>;
    }, "strip", z.ZodTypeAny, {
        ordering: "ASC" | "DESC";
    }, {
        ordering: "ASC" | "DESC";
    }>>, "many">, z.ZodString]>>;
    limit: z.ZodOptional<z.ZodObject<{
        limit: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit?: number | undefined;
        offset?: number | undefined;
    }, {
        limit?: number | undefined;
        offset?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    select: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[];
    from: {
        databaseName: string;
        tableName: string;
    };
    where: string;
    limit?: {
        limit?: number | undefined;
        offset?: number | undefined;
    } | undefined;
    whereLanguage?: "sql" | "lucene" | undefined;
    groupBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[] | undefined;
    having?: string | undefined;
    havingLanguage?: "sql" | "lucene" | undefined;
    orderBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        ordering: "ASC" | "DESC";
    })[] | undefined;
}, {
    select: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[];
    from: {
        databaseName: string;
        tableName: string;
    };
    where: string;
    limit?: {
        limit?: number | undefined;
        offset?: number | undefined;
    } | undefined;
    whereLanguage?: "sql" | "lucene" | undefined;
    groupBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[] | undefined;
    having?: string | undefined;
    havingLanguage?: "sql" | "lucene" | undefined;
    orderBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        ordering: "ASC" | "DESC";
    })[] | undefined;
}>>, z.ZodObject<{
    with: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        sql: z.ZodOptional<z.ZodObject<{
            sql: z.ZodString;
            params: z.ZodRecord<z.ZodString, z.ZodAny>;
        }, "strip", z.ZodTypeAny, {
            sql: string;
            params: Record<string, any>;
        }, {
            sql: string;
            params: Record<string, any>;
        }>>;
        chartConfig: z.ZodOptional<z.ZodIntersection<z.ZodObject<{
            displayType: z.ZodOptional<z.ZodNativeEnum<typeof DisplayType>>;
            numberFormat: z.ZodOptional<z.ZodObject<{
                output: z.ZodEnum<["currency", "percent", "byte", "time", "number"]>;
                mantissa: z.ZodOptional<z.ZodNumber>;
                thousandSeparated: z.ZodOptional<z.ZodBoolean>;
                average: z.ZodOptional<z.ZodBoolean>;
                decimalBytes: z.ZodOptional<z.ZodBoolean>;
                factor: z.ZodOptional<z.ZodNumber>;
                currencySymbol: z.ZodOptional<z.ZodString>;
                unit: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            }, {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            }>>;
            timestampValueExpression: z.ZodOptional<z.ZodString>;
            implicitColumnExpression: z.ZodOptional<z.ZodString>;
            fallbackAttributeExpression: z.ZodOptional<z.ZodString>;
            columnAliases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            granularity: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"auto">]>>;
            markdown: z.ZodOptional<z.ZodString>;
            filtersLogicalOperator: z.ZodOptional<z.ZodEnum<["AND", "OR"]>>;
            filters: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
                type: z.ZodEnum<["lucene", "sql"]>;
                condition: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "sql" | "lucene";
                condition: string;
            }, {
                type: "sql" | "lucene";
                condition: string;
            }>, z.ZodObject<{
                type: z.ZodLiteral<"sql_ast">;
                operator: z.ZodEnum<["=", "<", ">", "!=", "<=", ">="]>;
                left: z.ZodString;
                right: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            }, {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            }>]>, "many">>;
            connection: z.ZodString;
            fillNulls: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<false>]>>;
            selectGroupBy: z.ZodOptional<z.ZodBoolean>;
            metricTables: z.ZodOptional<z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }>, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }>>;
            seriesReturnType: z.ZodOptional<z.ZodEnum<["ratio", "column"]>>;
        }, "strip", z.ZodTypeAny, {
            connection: string;
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            timestampValueExpression?: string | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        }, {
            connection: string;
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            timestampValueExpression?: string | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        }>, z.ZodObject<{
            select: z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
                aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>, z.ZodObject<{
                aggFn: z.ZodLiteral<"quantile">;
                level: z.ZodNumber;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>]>, z.ZodObject<{
                aggFn: z.ZodOptional<z.ZodString>;
                aggCondition: z.ZodOptional<z.ZodString>;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            }, "strip", z.ZodTypeAny, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }>]>, z.ZodObject<{
                alias: z.ZodOptional<z.ZodString>;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
                metricName: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }>>, "many">, z.ZodString]>;
            from: z.ZodObject<{
                databaseName: z.ZodString;
                tableName: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                databaseName: string;
                tableName: string;
            }, {
                databaseName: string;
                tableName: string;
            }>;
            where: z.ZodString;
            whereLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            groupBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
                aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>, z.ZodObject<{
                aggFn: z.ZodLiteral<"quantile">;
                level: z.ZodNumber;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>]>, z.ZodObject<{
                aggFn: z.ZodOptional<z.ZodString>;
                aggCondition: z.ZodOptional<z.ZodString>;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            }, "strip", z.ZodTypeAny, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }>]>, z.ZodObject<{
                alias: z.ZodOptional<z.ZodString>;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
                metricName: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }>>, "many">, z.ZodString]>>;
            having: z.ZodOptional<z.ZodString>;
            havingLanguage: z.ZodOptional<z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>>;
            orderBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
                aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>, z.ZodObject<{
                aggFn: z.ZodLiteral<"quantile">;
                level: z.ZodNumber;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>]>, z.ZodObject<{
                aggFn: z.ZodOptional<z.ZodString>;
                aggCondition: z.ZodOptional<z.ZodString>;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            }, "strip", z.ZodTypeAny, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }>]>, z.ZodObject<{
                ordering: z.ZodEnum<["ASC", "DESC"]>;
            }, "strip", z.ZodTypeAny, {
                ordering: "ASC" | "DESC";
            }, {
                ordering: "ASC" | "DESC";
            }>>, "many">, z.ZodString]>>;
            limit: z.ZodOptional<z.ZodObject<{
                limit: z.ZodOptional<z.ZodNumber>;
                offset: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                limit?: number | undefined;
                offset?: number | undefined;
            }, {
                limit?: number | undefined;
                offset?: number | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            from: {
                databaseName: string;
                tableName: string;
            };
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        }, {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            from: {
                databaseName: string;
                tableName: string;
            };
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        }>>>;
        isSubquery: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        sql?: {
            sql: string;
            params: Record<string, any>;
        } | undefined;
        chartConfig?: ({
            connection: string;
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            timestampValueExpression?: string | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            from: {
                databaseName: string;
                tableName: string;
            };
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        }) | undefined;
        isSubquery?: boolean | undefined;
    }, {
        name: string;
        sql?: {
            sql: string;
            params: Record<string, any>;
        } | undefined;
        chartConfig?: ({
            connection: string;
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            timestampValueExpression?: string | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            from: {
                databaseName: string;
                tableName: string;
            };
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        }) | undefined;
        isSubquery?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    with?: {
        name: string;
        sql?: {
            sql: string;
            params: Record<string, any>;
        } | undefined;
        chartConfig?: ({
            connection: string;
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            timestampValueExpression?: string | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            from: {
                databaseName: string;
                tableName: string;
            };
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        }) | undefined;
        isSubquery?: boolean | undefined;
    }[] | undefined;
}, {
    with?: {
        name: string;
        sql?: {
            sql: string;
            params: Record<string, any>;
        } | undefined;
        chartConfig?: ({
            connection: string;
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            timestampValueExpression?: string | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            from: {
                databaseName: string;
                tableName: string;
            };
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        }) | undefined;
        isSubquery?: boolean | undefined;
    }[] | undefined;
}>>;
type ChartConfig = z.infer<typeof ChartConfigSchema>;
type DateRange = {
    dateRange: [Date, Date];
    dateRangeStartInclusive?: boolean;
    dateRangeEndInclusive?: boolean;
};
type ChartConfigWithDateRange = ChartConfig & DateRange;
type ChartConfigWithOptDateRange = Omit<ChartConfig, 'timestampValueExpression'> & {
    timestampValueExpression?: string;
} & Partial<DateRange>;
declare const SavedChartConfigSchema: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
    name: z.ZodString;
    source: z.ZodString;
    alert: z.ZodUnion<[z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
        threshold: z.ZodNumber;
        thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
        channel: z.ZodObject<{
            type: z.ZodLiteral<"webhook">;
            webhookId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "webhook";
            webhookId: string;
        }, {
            type: "webhook";
            webhookId: string;
        }>;
        state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
        name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        silenced: z.ZodOptional<z.ZodObject<{
            by: z.ZodString;
            at: z.ZodString;
            until: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            at: string;
            by: string;
            until: string;
        }, {
            at: string;
            by: string;
            until: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    }, {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    }>>, z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
        id: z.ZodOptional<z.ZodString>;
        interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
        threshold: z.ZodNumber;
        thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
        channel: z.ZodObject<{
            type: z.ZodLiteral<"webhook">;
            webhookId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "webhook";
            webhookId: string;
        }, {
            type: "webhook";
            webhookId: string;
        }>;
        state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
        name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        silenced: z.ZodOptional<z.ZodObject<{
            by: z.ZodString;
            at: z.ZodString;
            until: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            at: string;
            by: string;
            until: string;
        }, {
            at: string;
            by: string;
            until: string;
        }>>;
    }, {
        threshold: z.ZodNumber;
    }>, "strip", z.ZodTypeAny, {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    }, {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    }>>]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    source: string;
    alert?: {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    } | {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    } | undefined;
}, {
    name: string;
    source: string;
    alert?: {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    } | {
        interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
        threshold: number;
        thresholdType: AlertThresholdType;
        channel: {
            type: "webhook";
            webhookId: string;
        };
        message?: string | null | undefined;
        name?: string | null | undefined;
        id?: string | undefined;
        state?: AlertState | undefined;
        silenced?: {
            at: string;
            by: string;
            until: string;
        } | undefined;
    } | undefined;
}>, z.ZodObject<Omit<{
    displayType: z.ZodOptional<z.ZodNativeEnum<typeof DisplayType>>;
    numberFormat: z.ZodOptional<z.ZodObject<{
        output: z.ZodEnum<["currency", "percent", "byte", "time", "number"]>;
        mantissa: z.ZodOptional<z.ZodNumber>;
        thousandSeparated: z.ZodOptional<z.ZodBoolean>;
        average: z.ZodOptional<z.ZodBoolean>;
        decimalBytes: z.ZodOptional<z.ZodBoolean>;
        factor: z.ZodOptional<z.ZodNumber>;
        currencySymbol: z.ZodOptional<z.ZodString>;
        unit: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    }, {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    }>>;
    timestampValueExpression: z.ZodString;
    implicitColumnExpression: z.ZodOptional<z.ZodString>;
    fallbackAttributeExpression: z.ZodOptional<z.ZodString>;
    columnAliases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    granularity: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"auto">]>>;
    markdown: z.ZodOptional<z.ZodString>;
    filtersLogicalOperator: z.ZodOptional<z.ZodEnum<["AND", "OR"]>>;
    filters: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodEnum<["lucene", "sql"]>;
        condition: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "sql" | "lucene";
        condition: string;
    }, {
        type: "sql" | "lucene";
        condition: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"sql_ast">;
        operator: z.ZodEnum<["=", "<", ">", "!=", "<=", ">="]>;
        left: z.ZodString;
        right: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    }, {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    }>]>, "many">>;
    connection: z.ZodString;
    fillNulls: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<false>]>>;
    selectGroupBy: z.ZodOptional<z.ZodBoolean>;
    metricTables: z.ZodOptional<z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>>;
    seriesReturnType: z.ZodOptional<z.ZodEnum<["ratio", "column"]>>;
}, "timestampValueExpression" | "connection">, "strip", z.ZodTypeAny, {
    displayType?: DisplayType | undefined;
    numberFormat?: {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    } | undefined;
    implicitColumnExpression?: string | undefined;
    fallbackAttributeExpression?: string | undefined;
    columnAliases?: Record<string, string> | undefined;
    granularity?: string | undefined;
    markdown?: string | undefined;
    filtersLogicalOperator?: "AND" | "OR" | undefined;
    filters?: ({
        type: "sql" | "lucene";
        condition: string;
    } | {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    })[] | undefined;
    fillNulls?: number | false | undefined;
    selectGroupBy?: boolean | undefined;
    metricTables?: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    } | undefined;
    seriesReturnType?: "column" | "ratio" | undefined;
}, {
    displayType?: DisplayType | undefined;
    numberFormat?: {
        output: "number" | "currency" | "percent" | "byte" | "time";
        mantissa?: number | undefined;
        thousandSeparated?: boolean | undefined;
        average?: boolean | undefined;
        decimalBytes?: boolean | undefined;
        factor?: number | undefined;
        currencySymbol?: string | undefined;
        unit?: string | undefined;
    } | undefined;
    implicitColumnExpression?: string | undefined;
    fallbackAttributeExpression?: string | undefined;
    columnAliases?: Record<string, string> | undefined;
    granularity?: string | undefined;
    markdown?: string | undefined;
    filtersLogicalOperator?: "AND" | "OR" | undefined;
    filters?: ({
        type: "sql" | "lucene";
        condition: string;
    } | {
        type: "sql_ast";
        operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
        left: string;
        right: string;
    })[] | undefined;
    fillNulls?: number | false | undefined;
    selectGroupBy?: boolean | undefined;
    metricTables?: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    } | undefined;
    seriesReturnType?: "column" | "ratio" | undefined;
}>>, z.ZodObject<Omit<{
    select: z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        metricName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }>>, "many">, z.ZodString]>;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    where: z.ZodString;
    whereLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
    groupBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        metricName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }, {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    }>>, "many">, z.ZodString]>>;
    having: z.ZodOptional<z.ZodString>;
    havingLanguage: z.ZodOptional<z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>>;
    orderBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>, z.ZodObject<{
        aggFn: z.ZodLiteral<"quantile">;
        level: z.ZodNumber;
        aggCondition: z.ZodString;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }, {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    }>]>, z.ZodObject<{
        aggFn: z.ZodOptional<z.ZodString>;
        aggCondition: z.ZodOptional<z.ZodString>;
        aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        valueExpression: z.ZodString;
        metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
    }, "strip", z.ZodTypeAny, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }, {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }>]>, z.ZodObject<{
        ordering: z.ZodEnum<["ASC", "DESC"]>;
    }, "strip", z.ZodTypeAny, {
        ordering: "ASC" | "DESC";
    }, {
        ordering: "ASC" | "DESC";
    }>>, "many">, z.ZodString]>>;
    limit: z.ZodOptional<z.ZodObject<{
        limit: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit?: number | undefined;
        offset?: number | undefined;
    }, {
        limit?: number | undefined;
        offset?: number | undefined;
    }>>;
}, "from">, "strip", z.ZodTypeAny, {
    select: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[];
    where: string;
    limit?: {
        limit?: number | undefined;
        offset?: number | undefined;
    } | undefined;
    whereLanguage?: "sql" | "lucene" | undefined;
    groupBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[] | undefined;
    having?: string | undefined;
    havingLanguage?: "sql" | "lucene" | undefined;
    orderBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        ordering: "ASC" | "DESC";
    })[] | undefined;
}, {
    select: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[];
    where: string;
    limit?: {
        limit?: number | undefined;
        offset?: number | undefined;
    } | undefined;
    whereLanguage?: "sql" | "lucene" | undefined;
    groupBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        metricName?: string | undefined;
        metricType?: MetricsDataType | undefined;
        alias?: string | undefined;
    })[] | undefined;
    having?: string | undefined;
    havingLanguage?: "sql" | "lucene" | undefined;
    orderBy?: string | (({
        aggFn: string;
        aggCondition: string;
        valueExpression: string;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        aggFn: "quantile";
        aggCondition: string;
        valueExpression: string;
        level: number;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
    } | {
        valueExpression: string;
        aggFn?: string | undefined;
        aggCondition?: string | undefined;
        aggConditionLanguage?: "sql" | "lucene" | undefined;
        metricType?: MetricsDataType | undefined;
    }) & {
        ordering: "ASC" | "DESC";
    })[] | undefined;
}>>;
type SavedChartConfig = z.infer<typeof SavedChartConfigSchema>;
declare const TileSchema: z.ZodObject<{
    id: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
    w: z.ZodNumber;
    h: z.ZodNumber;
    config: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
        name: z.ZodString;
        source: z.ZodString;
        alert: z.ZodUnion<[z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
            threshold: z.ZodNumber;
            thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
            channel: z.ZodObject<{
                type: z.ZodLiteral<"webhook">;
                webhookId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "webhook";
                webhookId: string;
            }, {
                type: "webhook";
                webhookId: string;
            }>;
            state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
            name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            silenced: z.ZodOptional<z.ZodObject<{
                by: z.ZodString;
                at: z.ZodString;
                until: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                at: string;
                by: string;
                until: string;
            }, {
                at: string;
                by: string;
                until: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        }, {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        }>>, z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
            id: z.ZodOptional<z.ZodString>;
            interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
            threshold: z.ZodNumber;
            thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
            channel: z.ZodObject<{
                type: z.ZodLiteral<"webhook">;
                webhookId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "webhook";
                webhookId: string;
            }, {
                type: "webhook";
                webhookId: string;
            }>;
            state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
            name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            silenced: z.ZodOptional<z.ZodObject<{
                by: z.ZodString;
                at: z.ZodString;
                until: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                at: string;
                by: string;
                until: string;
            }, {
                at: string;
                by: string;
                until: string;
            }>>;
        }, {
            threshold: z.ZodNumber;
        }>, "strip", z.ZodTypeAny, {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        }, {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        }>>]>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        source: string;
        alert?: {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        } | {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        } | undefined;
    }, {
        name: string;
        source: string;
        alert?: {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        } | {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        } | undefined;
    }>, z.ZodObject<Omit<{
        displayType: z.ZodOptional<z.ZodNativeEnum<typeof DisplayType>>;
        numberFormat: z.ZodOptional<z.ZodObject<{
            output: z.ZodEnum<["currency", "percent", "byte", "time", "number"]>;
            mantissa: z.ZodOptional<z.ZodNumber>;
            thousandSeparated: z.ZodOptional<z.ZodBoolean>;
            average: z.ZodOptional<z.ZodBoolean>;
            decimalBytes: z.ZodOptional<z.ZodBoolean>;
            factor: z.ZodOptional<z.ZodNumber>;
            currencySymbol: z.ZodOptional<z.ZodString>;
            unit: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            output: "number" | "currency" | "percent" | "byte" | "time";
            mantissa?: number | undefined;
            thousandSeparated?: boolean | undefined;
            average?: boolean | undefined;
            decimalBytes?: boolean | undefined;
            factor?: number | undefined;
            currencySymbol?: string | undefined;
            unit?: string | undefined;
        }, {
            output: "number" | "currency" | "percent" | "byte" | "time";
            mantissa?: number | undefined;
            thousandSeparated?: boolean | undefined;
            average?: boolean | undefined;
            decimalBytes?: boolean | undefined;
            factor?: number | undefined;
            currencySymbol?: string | undefined;
            unit?: string | undefined;
        }>>;
        timestampValueExpression: z.ZodString;
        implicitColumnExpression: z.ZodOptional<z.ZodString>;
        fallbackAttributeExpression: z.ZodOptional<z.ZodString>;
        columnAliases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        granularity: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"auto">]>>;
        markdown: z.ZodOptional<z.ZodString>;
        filtersLogicalOperator: z.ZodOptional<z.ZodEnum<["AND", "OR"]>>;
        filters: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
            type: z.ZodEnum<["lucene", "sql"]>;
            condition: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "sql" | "lucene";
            condition: string;
        }, {
            type: "sql" | "lucene";
            condition: string;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"sql_ast">;
            operator: z.ZodEnum<["=", "<", ">", "!=", "<=", ">="]>;
            left: z.ZodString;
            right: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "sql_ast";
            operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
            left: string;
            right: string;
        }, {
            type: "sql_ast";
            operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
            left: string;
            right: string;
        }>]>, "many">>;
        connection: z.ZodString;
        fillNulls: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<false>]>>;
        selectGroupBy: z.ZodOptional<z.ZodBoolean>;
        metricTables: z.ZodOptional<z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
            gauge: string;
            histogram: string;
            sum: string;
            summary: string;
            "exponential histogram": string;
        }, {
            gauge: string;
            histogram: string;
            sum: string;
            summary: string;
            "exponential histogram": string;
        }>, {
            gauge: string;
            histogram: string;
            sum: string;
            summary: string;
            "exponential histogram": string;
        }, {
            gauge: string;
            histogram: string;
            sum: string;
            summary: string;
            "exponential histogram": string;
        }>>;
        seriesReturnType: z.ZodOptional<z.ZodEnum<["ratio", "column"]>>;
    }, "timestampValueExpression" | "connection">, "strip", z.ZodTypeAny, {
        displayType?: DisplayType | undefined;
        numberFormat?: {
            output: "number" | "currency" | "percent" | "byte" | "time";
            mantissa?: number | undefined;
            thousandSeparated?: boolean | undefined;
            average?: boolean | undefined;
            decimalBytes?: boolean | undefined;
            factor?: number | undefined;
            currencySymbol?: string | undefined;
            unit?: string | undefined;
        } | undefined;
        implicitColumnExpression?: string | undefined;
        fallbackAttributeExpression?: string | undefined;
        columnAliases?: Record<string, string> | undefined;
        granularity?: string | undefined;
        markdown?: string | undefined;
        filtersLogicalOperator?: "AND" | "OR" | undefined;
        filters?: ({
            type: "sql" | "lucene";
            condition: string;
        } | {
            type: "sql_ast";
            operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
            left: string;
            right: string;
        })[] | undefined;
        fillNulls?: number | false | undefined;
        selectGroupBy?: boolean | undefined;
        metricTables?: {
            gauge: string;
            histogram: string;
            sum: string;
            summary: string;
            "exponential histogram": string;
        } | undefined;
        seriesReturnType?: "column" | "ratio" | undefined;
    }, {
        displayType?: DisplayType | undefined;
        numberFormat?: {
            output: "number" | "currency" | "percent" | "byte" | "time";
            mantissa?: number | undefined;
            thousandSeparated?: boolean | undefined;
            average?: boolean | undefined;
            decimalBytes?: boolean | undefined;
            factor?: number | undefined;
            currencySymbol?: string | undefined;
            unit?: string | undefined;
        } | undefined;
        implicitColumnExpression?: string | undefined;
        fallbackAttributeExpression?: string | undefined;
        columnAliases?: Record<string, string> | undefined;
        granularity?: string | undefined;
        markdown?: string | undefined;
        filtersLogicalOperator?: "AND" | "OR" | undefined;
        filters?: ({
            type: "sql" | "lucene";
            condition: string;
        } | {
            type: "sql_ast";
            operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
            left: string;
            right: string;
        })[] | undefined;
        fillNulls?: number | false | undefined;
        selectGroupBy?: boolean | undefined;
        metricTables?: {
            gauge: string;
            histogram: string;
            sum: string;
            summary: string;
            "exponential histogram": string;
        } | undefined;
        seriesReturnType?: "column" | "ratio" | undefined;
    }>>, z.ZodObject<Omit<{
        select: z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
            aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
            aggCondition: z.ZodString;
            aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            valueExpression: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }, {
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }>, z.ZodObject<{
            aggFn: z.ZodLiteral<"quantile">;
            level: z.ZodNumber;
            aggCondition: z.ZodString;
            aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            valueExpression: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }, {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }>]>, z.ZodObject<{
            aggFn: z.ZodOptional<z.ZodString>;
            aggCondition: z.ZodOptional<z.ZodString>;
            aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            valueExpression: z.ZodString;
            metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        }, "strip", z.ZodTypeAny, {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }, {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }>]>, z.ZodObject<{
            alias: z.ZodOptional<z.ZodString>;
            metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            metricName: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        }, {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        }>>, "many">, z.ZodString]>;
        from: z.ZodObject<{
            databaseName: z.ZodString;
            tableName: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            databaseName: string;
            tableName: string;
        }, {
            databaseName: string;
            tableName: string;
        }>;
        where: z.ZodString;
        whereLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
        groupBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
            aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
            aggCondition: z.ZodString;
            aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            valueExpression: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }, {
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }>, z.ZodObject<{
            aggFn: z.ZodLiteral<"quantile">;
            level: z.ZodNumber;
            aggCondition: z.ZodString;
            aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            valueExpression: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }, {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }>]>, z.ZodObject<{
            aggFn: z.ZodOptional<z.ZodString>;
            aggCondition: z.ZodOptional<z.ZodString>;
            aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            valueExpression: z.ZodString;
            metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        }, "strip", z.ZodTypeAny, {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }, {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }>]>, z.ZodObject<{
            alias: z.ZodOptional<z.ZodString>;
            metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            metricName: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        }, {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        }>>, "many">, z.ZodString]>>;
        having: z.ZodOptional<z.ZodString>;
        havingLanguage: z.ZodOptional<z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>>;
        orderBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
            aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
            aggCondition: z.ZodString;
            aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            valueExpression: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }, {
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }>, z.ZodObject<{
            aggFn: z.ZodLiteral<"quantile">;
            level: z.ZodNumber;
            aggCondition: z.ZodString;
            aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            valueExpression: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }, {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        }>]>, z.ZodObject<{
            aggFn: z.ZodOptional<z.ZodString>;
            aggCondition: z.ZodOptional<z.ZodString>;
            aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            valueExpression: z.ZodString;
            metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
        }, "strip", z.ZodTypeAny, {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }, {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }>]>, z.ZodObject<{
            ordering: z.ZodEnum<["ASC", "DESC"]>;
        }, "strip", z.ZodTypeAny, {
            ordering: "ASC" | "DESC";
        }, {
            ordering: "ASC" | "DESC";
        }>>, "many">, z.ZodString]>>;
        limit: z.ZodOptional<z.ZodObject<{
            limit: z.ZodOptional<z.ZodNumber>;
            offset: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            limit?: number | undefined;
            offset?: number | undefined;
        }, {
            limit?: number | undefined;
            offset?: number | undefined;
        }>>;
    }, "from">, "strip", z.ZodTypeAny, {
        select: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        })[];
        where: string;
        limit?: {
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined;
        whereLanguage?: "sql" | "lucene" | undefined;
        groupBy?: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        })[] | undefined;
        having?: string | undefined;
        havingLanguage?: "sql" | "lucene" | undefined;
        orderBy?: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            ordering: "ASC" | "DESC";
        })[] | undefined;
    }, {
        select: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        })[];
        where: string;
        limit?: {
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined;
        whereLanguage?: "sql" | "lucene" | undefined;
        groupBy?: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        })[] | undefined;
        having?: string | undefined;
        havingLanguage?: "sql" | "lucene" | undefined;
        orderBy?: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            ordering: "ASC" | "DESC";
        })[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    config: {
        name: string;
        source: string;
        alert?: {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        } | {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        } | undefined;
    } & {
        displayType?: DisplayType | undefined;
        numberFormat?: {
            output: "number" | "currency" | "percent" | "byte" | "time";
            mantissa?: number | undefined;
            thousandSeparated?: boolean | undefined;
            average?: boolean | undefined;
            decimalBytes?: boolean | undefined;
            factor?: number | undefined;
            currencySymbol?: string | undefined;
            unit?: string | undefined;
        } | undefined;
        implicitColumnExpression?: string | undefined;
        fallbackAttributeExpression?: string | undefined;
        columnAliases?: Record<string, string> | undefined;
        granularity?: string | undefined;
        markdown?: string | undefined;
        filtersLogicalOperator?: "AND" | "OR" | undefined;
        filters?: ({
            type: "sql" | "lucene";
            condition: string;
        } | {
            type: "sql_ast";
            operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
            left: string;
            right: string;
        })[] | undefined;
        fillNulls?: number | false | undefined;
        selectGroupBy?: boolean | undefined;
        metricTables?: {
            gauge: string;
            histogram: string;
            sum: string;
            summary: string;
            "exponential histogram": string;
        } | undefined;
        seriesReturnType?: "column" | "ratio" | undefined;
    } & {
        select: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        })[];
        where: string;
        limit?: {
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined;
        whereLanguage?: "sql" | "lucene" | undefined;
        groupBy?: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        })[] | undefined;
        having?: string | undefined;
        havingLanguage?: "sql" | "lucene" | undefined;
        orderBy?: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            ordering: "ASC" | "DESC";
        })[] | undefined;
    };
}, {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    config: {
        name: string;
        source: string;
        alert?: {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        } | {
            interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
            threshold: number;
            thresholdType: AlertThresholdType;
            channel: {
                type: "webhook";
                webhookId: string;
            };
            message?: string | null | undefined;
            name?: string | null | undefined;
            id?: string | undefined;
            state?: AlertState | undefined;
            silenced?: {
                at: string;
                by: string;
                until: string;
            } | undefined;
        } | undefined;
    } & {
        displayType?: DisplayType | undefined;
        numberFormat?: {
            output: "number" | "currency" | "percent" | "byte" | "time";
            mantissa?: number | undefined;
            thousandSeparated?: boolean | undefined;
            average?: boolean | undefined;
            decimalBytes?: boolean | undefined;
            factor?: number | undefined;
            currencySymbol?: string | undefined;
            unit?: string | undefined;
        } | undefined;
        implicitColumnExpression?: string | undefined;
        fallbackAttributeExpression?: string | undefined;
        columnAliases?: Record<string, string> | undefined;
        granularity?: string | undefined;
        markdown?: string | undefined;
        filtersLogicalOperator?: "AND" | "OR" | undefined;
        filters?: ({
            type: "sql" | "lucene";
            condition: string;
        } | {
            type: "sql_ast";
            operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
            left: string;
            right: string;
        })[] | undefined;
        fillNulls?: number | false | undefined;
        selectGroupBy?: boolean | undefined;
        metricTables?: {
            gauge: string;
            histogram: string;
            sum: string;
            summary: string;
            "exponential histogram": string;
        } | undefined;
        seriesReturnType?: "column" | "ratio" | undefined;
    } & {
        select: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        })[];
        where: string;
        limit?: {
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined;
        whereLanguage?: "sql" | "lucene" | undefined;
        groupBy?: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            metricName?: string | undefined;
            metricType?: MetricsDataType | undefined;
            alias?: string | undefined;
        })[] | undefined;
        having?: string | undefined;
        havingLanguage?: "sql" | "lucene" | undefined;
        orderBy?: string | (({
            aggFn: string;
            aggCondition: string;
            valueExpression: string;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            aggFn: "quantile";
            aggCondition: string;
            valueExpression: string;
            level: number;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
        } | {
            valueExpression: string;
            aggFn?: string | undefined;
            aggCondition?: string | undefined;
            aggConditionLanguage?: "sql" | "lucene" | undefined;
            metricType?: MetricsDataType | undefined;
        }) & {
            ordering: "ASC" | "DESC";
        })[] | undefined;
    };
}>;
type Tile = z.infer<typeof TileSchema>;
declare const DashboardSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    tiles: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
        config: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
            name: z.ZodString;
            source: z.ZodString;
            alert: z.ZodUnion<[z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
                threshold: z.ZodNumber;
                thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
                channel: z.ZodObject<{
                    type: z.ZodLiteral<"webhook">;
                    webhookId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    type: "webhook";
                    webhookId: string;
                }, {
                    type: "webhook";
                    webhookId: string;
                }>;
                state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
                name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                silenced: z.ZodOptional<z.ZodObject<{
                    by: z.ZodString;
                    at: z.ZodString;
                    until: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    at: string;
                    by: string;
                    until: string;
                }, {
                    at: string;
                    by: string;
                    until: string;
                }>>;
            }, "strip", z.ZodTypeAny, {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            }, {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            }>>, z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
                id: z.ZodOptional<z.ZodString>;
                interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
                threshold: z.ZodNumber;
                thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
                channel: z.ZodObject<{
                    type: z.ZodLiteral<"webhook">;
                    webhookId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    type: "webhook";
                    webhookId: string;
                }, {
                    type: "webhook";
                    webhookId: string;
                }>;
                state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
                name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                silenced: z.ZodOptional<z.ZodObject<{
                    by: z.ZodString;
                    at: z.ZodString;
                    until: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    at: string;
                    by: string;
                    until: string;
                }, {
                    at: string;
                    by: string;
                    until: string;
                }>>;
            }, {
                threshold: z.ZodNumber;
            }>, "strip", z.ZodTypeAny, {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            }, {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            }>>]>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        }, {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        }>, z.ZodObject<Omit<{
            displayType: z.ZodOptional<z.ZodNativeEnum<typeof DisplayType>>;
            numberFormat: z.ZodOptional<z.ZodObject<{
                output: z.ZodEnum<["currency", "percent", "byte", "time", "number"]>;
                mantissa: z.ZodOptional<z.ZodNumber>;
                thousandSeparated: z.ZodOptional<z.ZodBoolean>;
                average: z.ZodOptional<z.ZodBoolean>;
                decimalBytes: z.ZodOptional<z.ZodBoolean>;
                factor: z.ZodOptional<z.ZodNumber>;
                currencySymbol: z.ZodOptional<z.ZodString>;
                unit: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            }, {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            }>>;
            timestampValueExpression: z.ZodString;
            implicitColumnExpression: z.ZodOptional<z.ZodString>;
            fallbackAttributeExpression: z.ZodOptional<z.ZodString>;
            columnAliases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            granularity: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"auto">]>>;
            markdown: z.ZodOptional<z.ZodString>;
            filtersLogicalOperator: z.ZodOptional<z.ZodEnum<["AND", "OR"]>>;
            filters: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
                type: z.ZodEnum<["lucene", "sql"]>;
                condition: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "sql" | "lucene";
                condition: string;
            }, {
                type: "sql" | "lucene";
                condition: string;
            }>, z.ZodObject<{
                type: z.ZodLiteral<"sql_ast">;
                operator: z.ZodEnum<["=", "<", ">", "!=", "<=", ">="]>;
                left: z.ZodString;
                right: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            }, {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            }>]>, "many">>;
            connection: z.ZodString;
            fillNulls: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<false>]>>;
            selectGroupBy: z.ZodOptional<z.ZodBoolean>;
            metricTables: z.ZodOptional<z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }>, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }>>;
            seriesReturnType: z.ZodOptional<z.ZodEnum<["ratio", "column"]>>;
        }, "timestampValueExpression" | "connection">, "strip", z.ZodTypeAny, {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        }, {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        }>>, z.ZodObject<Omit<{
            select: z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
                aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>, z.ZodObject<{
                aggFn: z.ZodLiteral<"quantile">;
                level: z.ZodNumber;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>]>, z.ZodObject<{
                aggFn: z.ZodOptional<z.ZodString>;
                aggCondition: z.ZodOptional<z.ZodString>;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            }, "strip", z.ZodTypeAny, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }>]>, z.ZodObject<{
                alias: z.ZodOptional<z.ZodString>;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
                metricName: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }>>, "many">, z.ZodString]>;
            from: z.ZodObject<{
                databaseName: z.ZodString;
                tableName: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                databaseName: string;
                tableName: string;
            }, {
                databaseName: string;
                tableName: string;
            }>;
            where: z.ZodString;
            whereLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            groupBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
                aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>, z.ZodObject<{
                aggFn: z.ZodLiteral<"quantile">;
                level: z.ZodNumber;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>]>, z.ZodObject<{
                aggFn: z.ZodOptional<z.ZodString>;
                aggCondition: z.ZodOptional<z.ZodString>;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            }, "strip", z.ZodTypeAny, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }>]>, z.ZodObject<{
                alias: z.ZodOptional<z.ZodString>;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
                metricName: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }>>, "many">, z.ZodString]>>;
            having: z.ZodOptional<z.ZodString>;
            havingLanguage: z.ZodOptional<z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>>;
            orderBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
                aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>, z.ZodObject<{
                aggFn: z.ZodLiteral<"quantile">;
                level: z.ZodNumber;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>]>, z.ZodObject<{
                aggFn: z.ZodOptional<z.ZodString>;
                aggCondition: z.ZodOptional<z.ZodString>;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            }, "strip", z.ZodTypeAny, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }>]>, z.ZodObject<{
                ordering: z.ZodEnum<["ASC", "DESC"]>;
            }, "strip", z.ZodTypeAny, {
                ordering: "ASC" | "DESC";
            }, {
                ordering: "ASC" | "DESC";
            }>>, "many">, z.ZodString]>>;
            limit: z.ZodOptional<z.ZodObject<{
                limit: z.ZodOptional<z.ZodNumber>;
                offset: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                limit?: number | undefined;
                offset?: number | undefined;
            }, {
                limit?: number | undefined;
                offset?: number | undefined;
            }>>;
        }, "from">, "strip", z.ZodTypeAny, {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        }, {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        x: number;
        y: number;
        w: number;
        h: number;
        config: {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        } & {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        };
    }, {
        id: string;
        x: number;
        y: number;
        w: number;
        h: number;
        config: {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        } & {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        };
    }>, "many">;
    tags: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    tags: string[];
    tiles: {
        id: string;
        x: number;
        y: number;
        w: number;
        h: number;
        config: {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        } & {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        };
    }[];
}, {
    name: string;
    id: string;
    tags: string[];
    tiles: {
        id: string;
        x: number;
        y: number;
        w: number;
        h: number;
        config: {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        } & {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        };
    }[];
}>;
declare const DashboardWithoutIdSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    tiles: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
        config: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
            name: z.ZodString;
            source: z.ZodString;
            alert: z.ZodUnion<[z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
                threshold: z.ZodNumber;
                thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
                channel: z.ZodObject<{
                    type: z.ZodLiteral<"webhook">;
                    webhookId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    type: "webhook";
                    webhookId: string;
                }, {
                    type: "webhook";
                    webhookId: string;
                }>;
                state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
                name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                silenced: z.ZodOptional<z.ZodObject<{
                    by: z.ZodString;
                    at: z.ZodString;
                    until: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    at: string;
                    by: string;
                    until: string;
                }, {
                    at: string;
                    by: string;
                    until: string;
                }>>;
            }, "strip", z.ZodTypeAny, {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            }, {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            }>>, z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
                id: z.ZodOptional<z.ZodString>;
                interval: z.ZodUnion<[z.ZodLiteral<"1m">, z.ZodLiteral<"5m">, z.ZodLiteral<"15m">, z.ZodLiteral<"30m">, z.ZodLiteral<"1h">, z.ZodLiteral<"6h">, z.ZodLiteral<"12h">, z.ZodLiteral<"1d">]>;
                threshold: z.ZodNumber;
                thresholdType: z.ZodNativeEnum<typeof AlertThresholdType>;
                channel: z.ZodObject<{
                    type: z.ZodLiteral<"webhook">;
                    webhookId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    type: "webhook";
                    webhookId: string;
                }, {
                    type: "webhook";
                    webhookId: string;
                }>;
                state: z.ZodOptional<z.ZodNativeEnum<typeof AlertState>>;
                name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                silenced: z.ZodOptional<z.ZodObject<{
                    by: z.ZodString;
                    at: z.ZodString;
                    until: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    at: string;
                    by: string;
                    until: string;
                }, {
                    at: string;
                    by: string;
                    until: string;
                }>>;
            }, {
                threshold: z.ZodNumber;
            }>, "strip", z.ZodTypeAny, {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            }, {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            }>>]>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        }, {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        }>, z.ZodObject<Omit<{
            displayType: z.ZodOptional<z.ZodNativeEnum<typeof DisplayType>>;
            numberFormat: z.ZodOptional<z.ZodObject<{
                output: z.ZodEnum<["currency", "percent", "byte", "time", "number"]>;
                mantissa: z.ZodOptional<z.ZodNumber>;
                thousandSeparated: z.ZodOptional<z.ZodBoolean>;
                average: z.ZodOptional<z.ZodBoolean>;
                decimalBytes: z.ZodOptional<z.ZodBoolean>;
                factor: z.ZodOptional<z.ZodNumber>;
                currencySymbol: z.ZodOptional<z.ZodString>;
                unit: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            }, {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            }>>;
            timestampValueExpression: z.ZodString;
            implicitColumnExpression: z.ZodOptional<z.ZodString>;
            fallbackAttributeExpression: z.ZodOptional<z.ZodString>;
            columnAliases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            granularity: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"auto">]>>;
            markdown: z.ZodOptional<z.ZodString>;
            filtersLogicalOperator: z.ZodOptional<z.ZodEnum<["AND", "OR"]>>;
            filters: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
                type: z.ZodEnum<["lucene", "sql"]>;
                condition: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "sql" | "lucene";
                condition: string;
            }, {
                type: "sql" | "lucene";
                condition: string;
            }>, z.ZodObject<{
                type: z.ZodLiteral<"sql_ast">;
                operator: z.ZodEnum<["=", "<", ">", "!=", "<=", ">="]>;
                left: z.ZodString;
                right: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            }, {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            }>]>, "many">>;
            connection: z.ZodString;
            fillNulls: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<false>]>>;
            selectGroupBy: z.ZodOptional<z.ZodBoolean>;
            metricTables: z.ZodOptional<z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }>, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }, {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            }>>;
            seriesReturnType: z.ZodOptional<z.ZodEnum<["ratio", "column"]>>;
        }, "timestampValueExpression" | "connection">, "strip", z.ZodTypeAny, {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        }, {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        }>>, z.ZodObject<Omit<{
            select: z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
                aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>, z.ZodObject<{
                aggFn: z.ZodLiteral<"quantile">;
                level: z.ZodNumber;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>]>, z.ZodObject<{
                aggFn: z.ZodOptional<z.ZodString>;
                aggCondition: z.ZodOptional<z.ZodString>;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            }, "strip", z.ZodTypeAny, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }>]>, z.ZodObject<{
                alias: z.ZodOptional<z.ZodString>;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
                metricName: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }>>, "many">, z.ZodString]>;
            from: z.ZodObject<{
                databaseName: z.ZodString;
                tableName: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                databaseName: string;
                tableName: string;
            }, {
                databaseName: string;
                tableName: string;
            }>;
            where: z.ZodString;
            whereLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
            groupBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
                aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>, z.ZodObject<{
                aggFn: z.ZodLiteral<"quantile">;
                level: z.ZodNumber;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>]>, z.ZodObject<{
                aggFn: z.ZodOptional<z.ZodString>;
                aggCondition: z.ZodOptional<z.ZodString>;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            }, "strip", z.ZodTypeAny, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }>]>, z.ZodObject<{
                alias: z.ZodOptional<z.ZodString>;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
                metricName: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }, {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            }>>, "many">, z.ZodString]>>;
            having: z.ZodOptional<z.ZodString>;
            havingLanguage: z.ZodOptional<z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>>;
            orderBy: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodIntersection<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
                aggFn: z.ZodUnion<[z.ZodEnum<["avg", "count", "count_distinct", "last_value", "max", "min", "quantile", "sum"]>, z.ZodString]>;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>, z.ZodObject<{
                aggFn: z.ZodLiteral<"quantile">;
                level: z.ZodNumber;
                aggCondition: z.ZodString;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }, {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            }>]>, z.ZodObject<{
                aggFn: z.ZodOptional<z.ZodString>;
                aggCondition: z.ZodOptional<z.ZodString>;
                aggConditionLanguage: z.ZodOptional<z.ZodEnum<["sql", "lucene"]>>;
                valueExpression: z.ZodString;
                metricType: z.ZodOptional<z.ZodNativeEnum<typeof MetricsDataType>>;
            }, "strip", z.ZodTypeAny, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }, {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }>]>, z.ZodObject<{
                ordering: z.ZodEnum<["ASC", "DESC"]>;
            }, "strip", z.ZodTypeAny, {
                ordering: "ASC" | "DESC";
            }, {
                ordering: "ASC" | "DESC";
            }>>, "many">, z.ZodString]>>;
            limit: z.ZodOptional<z.ZodObject<{
                limit: z.ZodOptional<z.ZodNumber>;
                offset: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                limit?: number | undefined;
                offset?: number | undefined;
            }, {
                limit?: number | undefined;
                offset?: number | undefined;
            }>>;
        }, "from">, "strip", z.ZodTypeAny, {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        }, {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        x: number;
        y: number;
        w: number;
        h: number;
        config: {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        } & {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        };
    }, {
        id: string;
        x: number;
        y: number;
        w: number;
        h: number;
        config: {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        } & {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        };
    }>, "many">;
    tags: z.ZodArray<z.ZodString, "many">;
}, "id">, "strip", z.ZodTypeAny, {
    name: string;
    tags: string[];
    tiles: {
        id: string;
        x: number;
        y: number;
        w: number;
        h: number;
        config: {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        } & {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        };
    }[];
}, {
    name: string;
    tags: string[];
    tiles: {
        id: string;
        x: number;
        y: number;
        w: number;
        h: number;
        config: {
            name: string;
            source: string;
            alert?: {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | {
                interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "1d";
                threshold: number;
                thresholdType: AlertThresholdType;
                channel: {
                    type: "webhook";
                    webhookId: string;
                };
                message?: string | null | undefined;
                name?: string | null | undefined;
                id?: string | undefined;
                state?: AlertState | undefined;
                silenced?: {
                    at: string;
                    by: string;
                    until: string;
                } | undefined;
            } | undefined;
        } & {
            displayType?: DisplayType | undefined;
            numberFormat?: {
                output: "number" | "currency" | "percent" | "byte" | "time";
                mantissa?: number | undefined;
                thousandSeparated?: boolean | undefined;
                average?: boolean | undefined;
                decimalBytes?: boolean | undefined;
                factor?: number | undefined;
                currencySymbol?: string | undefined;
                unit?: string | undefined;
            } | undefined;
            implicitColumnExpression?: string | undefined;
            fallbackAttributeExpression?: string | undefined;
            columnAliases?: Record<string, string> | undefined;
            granularity?: string | undefined;
            markdown?: string | undefined;
            filtersLogicalOperator?: "AND" | "OR" | undefined;
            filters?: ({
                type: "sql" | "lucene";
                condition: string;
            } | {
                type: "sql_ast";
                operator: "=" | "<" | ">" | "!=" | "<=" | ">=";
                left: string;
                right: string;
            })[] | undefined;
            fillNulls?: number | false | undefined;
            selectGroupBy?: boolean | undefined;
            metricTables?: {
                gauge: string;
                histogram: string;
                sum: string;
                summary: string;
                "exponential histogram": string;
            } | undefined;
            seriesReturnType?: "column" | "ratio" | undefined;
        } & {
            select: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[];
            where: string;
            limit?: {
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            whereLanguage?: "sql" | "lucene" | undefined;
            groupBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                metricName?: string | undefined;
                metricType?: MetricsDataType | undefined;
                alias?: string | undefined;
            })[] | undefined;
            having?: string | undefined;
            havingLanguage?: "sql" | "lucene" | undefined;
            orderBy?: string | (({
                aggFn: string;
                aggCondition: string;
                valueExpression: string;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                aggFn: "quantile";
                aggCondition: string;
                valueExpression: string;
                level: number;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
            } | {
                valueExpression: string;
                aggFn?: string | undefined;
                aggCondition?: string | undefined;
                aggConditionLanguage?: "sql" | "lucene" | undefined;
                metricType?: MetricsDataType | undefined;
            }) & {
                ordering: "ASC" | "DESC";
            })[] | undefined;
        };
    }[];
}>;
declare const ConnectionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    host: z.ZodString;
    username: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    host: string;
    username: string;
    password?: string | undefined;
}, {
    name: string;
    id: string;
    host: string;
    username: string;
    password?: string | undefined;
}>;
type Connection = z.infer<typeof ConnectionSchema>;
declare enum SourceKind {
    Log = "log",
    Trace = "trace",
    Session = "session",
    Metric = "metric"
}
declare const SourceBaseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    kind: z.ZodNativeEnum<typeof SourceKind>;
    connection: z.ZodString;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    timestampValueExpression: z.ZodString;
}, "strip", z.ZodTypeAny, {
    timestampValueExpression: string;
    connection: string;
    from: {
        databaseName: string;
        tableName: string;
    };
    name: string;
    kind: SourceKind;
    id: string;
}, {
    timestampValueExpression: string;
    connection: string;
    from: {
        databaseName: string;
        tableName: string;
    };
    name: string;
    kind: SourceKind;
    id: string;
}>;
declare const SourceSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<z.objectUtil.extendShape<{
    id: z.ZodString;
    name: z.ZodString;
    kind: z.ZodNativeEnum<typeof SourceKind>;
    connection: z.ZodString;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    timestampValueExpression: z.ZodString;
}, {
    kind: z.ZodLiteral<SourceKind.Log>;
    defaultTableSelectExpression: z.ZodString;
    serviceNameExpression: z.ZodOptional<z.ZodString>;
    severityTextExpression: z.ZodOptional<z.ZodString>;
    bodyExpression: z.ZodOptional<z.ZodString>;
    eventAttributesExpression: z.ZodOptional<z.ZodString>;
    resourceAttributesExpression: z.ZodOptional<z.ZodString>;
    displayedTimestampValueExpression: z.ZodOptional<z.ZodString>;
    metricSourceId: z.ZodOptional<z.ZodString>;
    traceSourceId: z.ZodOptional<z.ZodString>;
    traceIdExpression: z.ZodOptional<z.ZodString>;
    spanIdExpression: z.ZodOptional<z.ZodString>;
    implicitColumnExpression: z.ZodOptional<z.ZodString>;
    uniqueRowIdExpression: z.ZodOptional<z.ZodString>;
    tableFilterExpression: z.ZodOptional<z.ZodString>;
}>, "strip", z.ZodTypeAny, {
    timestampValueExpression: string;
    connection: string;
    from: {
        databaseName: string;
        tableName: string;
    };
    name: string;
    kind: SourceKind.Log;
    id: string;
    defaultTableSelectExpression: string;
    implicitColumnExpression?: string | undefined;
    serviceNameExpression?: string | undefined;
    severityTextExpression?: string | undefined;
    bodyExpression?: string | undefined;
    eventAttributesExpression?: string | undefined;
    resourceAttributesExpression?: string | undefined;
    displayedTimestampValueExpression?: string | undefined;
    metricSourceId?: string | undefined;
    traceSourceId?: string | undefined;
    traceIdExpression?: string | undefined;
    spanIdExpression?: string | undefined;
    uniqueRowIdExpression?: string | undefined;
    tableFilterExpression?: string | undefined;
}, {
    timestampValueExpression: string;
    connection: string;
    from: {
        databaseName: string;
        tableName: string;
    };
    name: string;
    kind: SourceKind.Log;
    id: string;
    defaultTableSelectExpression: string;
    implicitColumnExpression?: string | undefined;
    serviceNameExpression?: string | undefined;
    severityTextExpression?: string | undefined;
    bodyExpression?: string | undefined;
    eventAttributesExpression?: string | undefined;
    resourceAttributesExpression?: string | undefined;
    displayedTimestampValueExpression?: string | undefined;
    metricSourceId?: string | undefined;
    traceSourceId?: string | undefined;
    traceIdExpression?: string | undefined;
    spanIdExpression?: string | undefined;
    uniqueRowIdExpression?: string | undefined;
    tableFilterExpression?: string | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<{
    id: z.ZodString;
    name: z.ZodString;
    kind: z.ZodNativeEnum<typeof SourceKind>;
    connection: z.ZodString;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    timestampValueExpression: z.ZodString;
}, {
    kind: z.ZodLiteral<SourceKind.Trace>;
    defaultTableSelectExpression: z.ZodOptional<z.ZodString>;
    durationExpression: z.ZodString;
    durationPrecision: z.ZodDefault<z.ZodNumber>;
    traceIdExpression: z.ZodString;
    spanIdExpression: z.ZodString;
    parentSpanIdExpression: z.ZodString;
    spanNameExpression: z.ZodString;
    spanKindExpression: z.ZodString;
    logSourceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sessionSourceId: z.ZodOptional<z.ZodString>;
    metricSourceId: z.ZodOptional<z.ZodString>;
    statusCodeExpression: z.ZodOptional<z.ZodString>;
    statusMessageExpression: z.ZodOptional<z.ZodString>;
    serviceNameExpression: z.ZodOptional<z.ZodString>;
    resourceAttributesExpression: z.ZodOptional<z.ZodString>;
    eventAttributesExpression: z.ZodOptional<z.ZodString>;
    spanEventsValueExpression: z.ZodOptional<z.ZodString>;
    implicitColumnExpression: z.ZodOptional<z.ZodString>;
}>, "strip", z.ZodTypeAny, {
    timestampValueExpression: string;
    connection: string;
    from: {
        databaseName: string;
        tableName: string;
    };
    name: string;
    kind: SourceKind.Trace;
    id: string;
    traceIdExpression: string;
    spanIdExpression: string;
    durationExpression: string;
    durationPrecision: number;
    parentSpanIdExpression: string;
    spanNameExpression: string;
    spanKindExpression: string;
    implicitColumnExpression?: string | undefined;
    defaultTableSelectExpression?: string | undefined;
    serviceNameExpression?: string | undefined;
    eventAttributesExpression?: string | undefined;
    resourceAttributesExpression?: string | undefined;
    metricSourceId?: string | undefined;
    logSourceId?: string | null | undefined;
    sessionSourceId?: string | undefined;
    statusCodeExpression?: string | undefined;
    statusMessageExpression?: string | undefined;
    spanEventsValueExpression?: string | undefined;
}, {
    timestampValueExpression: string;
    connection: string;
    from: {
        databaseName: string;
        tableName: string;
    };
    name: string;
    kind: SourceKind.Trace;
    id: string;
    traceIdExpression: string;
    spanIdExpression: string;
    durationExpression: string;
    parentSpanIdExpression: string;
    spanNameExpression: string;
    spanKindExpression: string;
    implicitColumnExpression?: string | undefined;
    defaultTableSelectExpression?: string | undefined;
    serviceNameExpression?: string | undefined;
    eventAttributesExpression?: string | undefined;
    resourceAttributesExpression?: string | undefined;
    metricSourceId?: string | undefined;
    durationPrecision?: number | undefined;
    logSourceId?: string | null | undefined;
    sessionSourceId?: string | undefined;
    statusCodeExpression?: string | undefined;
    statusMessageExpression?: string | undefined;
    spanEventsValueExpression?: string | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<{
    id: z.ZodString;
    name: z.ZodString;
    kind: z.ZodNativeEnum<typeof SourceKind>;
    connection: z.ZodString;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    timestampValueExpression: z.ZodString;
}, {
    kind: z.ZodLiteral<SourceKind.Session>;
    eventAttributesExpression: z.ZodString;
    resourceAttributesExpression: z.ZodString;
    traceSourceId: z.ZodString;
    implicitColumnExpression: z.ZodOptional<z.ZodString>;
}>, "strip", z.ZodTypeAny, {
    timestampValueExpression: string;
    connection: string;
    from: {
        databaseName: string;
        tableName: string;
    };
    name: string;
    kind: SourceKind.Session;
    id: string;
    eventAttributesExpression: string;
    resourceAttributesExpression: string;
    traceSourceId: string;
    implicitColumnExpression?: string | undefined;
}, {
    timestampValueExpression: string;
    connection: string;
    from: {
        databaseName: string;
        tableName: string;
    };
    name: string;
    kind: SourceKind.Session;
    id: string;
    eventAttributesExpression: string;
    resourceAttributesExpression: string;
    traceSourceId: string;
    implicitColumnExpression?: string | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<{
    id: z.ZodString;
    name: z.ZodString;
    kind: z.ZodNativeEnum<typeof SourceKind>;
    connection: z.ZodString;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    timestampValueExpression: z.ZodString;
}, {
    kind: z.ZodLiteral<SourceKind.Metric>;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    metricTables: z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>;
    resourceAttributesExpression: z.ZodString;
    logSourceId: z.ZodOptional<z.ZodString>;
}>, "strip", z.ZodTypeAny, {
    timestampValueExpression: string;
    connection: string;
    metricTables: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    };
    from: {
        databaseName: string;
        tableName: string;
    };
    name: string;
    kind: SourceKind.Metric;
    id: string;
    resourceAttributesExpression: string;
    logSourceId?: string | undefined;
}, {
    timestampValueExpression: string;
    connection: string;
    metricTables: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    };
    from: {
        databaseName: string;
        tableName: string;
    };
    name: string;
    kind: SourceKind.Metric;
    id: string;
    resourceAttributesExpression: string;
    logSourceId?: string | undefined;
}>]>;
type TSourceUnion = z.infer<typeof SourceSchema>;
declare function sourceSchemaWithout(omissions?: {
    [k in keyof z.infer<typeof SourceBaseSchema>]?: true;
}): z.ZodDiscriminatedUnion<"kind", [z.ZodObject<z.objectUtil.extendShape<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    kind: z.ZodNativeEnum<typeof SourceKind>;
    connection: z.ZodString;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    timestampValueExpression: z.ZodString;
}, "timestampValueExpression" | "connection" | "from" | "name" | "kind" | "id">, {
    kind: z.ZodLiteral<SourceKind.Log>;
    defaultTableSelectExpression: z.ZodString;
    serviceNameExpression: z.ZodOptional<z.ZodString>;
    severityTextExpression: z.ZodOptional<z.ZodString>;
    bodyExpression: z.ZodOptional<z.ZodString>;
    eventAttributesExpression: z.ZodOptional<z.ZodString>;
    resourceAttributesExpression: z.ZodOptional<z.ZodString>;
    displayedTimestampValueExpression: z.ZodOptional<z.ZodString>;
    metricSourceId: z.ZodOptional<z.ZodString>;
    traceSourceId: z.ZodOptional<z.ZodString>;
    traceIdExpression: z.ZodOptional<z.ZodString>;
    spanIdExpression: z.ZodOptional<z.ZodString>;
    implicitColumnExpression: z.ZodOptional<z.ZodString>;
    uniqueRowIdExpression: z.ZodOptional<z.ZodString>;
    tableFilterExpression: z.ZodOptional<z.ZodString>;
}>, "strip", z.ZodTypeAny, {
    kind: SourceKind.Log;
    defaultTableSelectExpression: string;
    implicitColumnExpression?: string | undefined;
    serviceNameExpression?: string | undefined;
    severityTextExpression?: string | undefined;
    bodyExpression?: string | undefined;
    eventAttributesExpression?: string | undefined;
    resourceAttributesExpression?: string | undefined;
    displayedTimestampValueExpression?: string | undefined;
    metricSourceId?: string | undefined;
    traceSourceId?: string | undefined;
    traceIdExpression?: string | undefined;
    spanIdExpression?: string | undefined;
    uniqueRowIdExpression?: string | undefined;
    tableFilterExpression?: string | undefined;
}, {
    kind: SourceKind.Log;
    defaultTableSelectExpression: string;
    implicitColumnExpression?: string | undefined;
    serviceNameExpression?: string | undefined;
    severityTextExpression?: string | undefined;
    bodyExpression?: string | undefined;
    eventAttributesExpression?: string | undefined;
    resourceAttributesExpression?: string | undefined;
    displayedTimestampValueExpression?: string | undefined;
    metricSourceId?: string | undefined;
    traceSourceId?: string | undefined;
    traceIdExpression?: string | undefined;
    spanIdExpression?: string | undefined;
    uniqueRowIdExpression?: string | undefined;
    tableFilterExpression?: string | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    kind: z.ZodNativeEnum<typeof SourceKind>;
    connection: z.ZodString;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    timestampValueExpression: z.ZodString;
}, "timestampValueExpression" | "connection" | "from" | "name" | "kind" | "id">, {
    kind: z.ZodLiteral<SourceKind.Trace>;
    defaultTableSelectExpression: z.ZodOptional<z.ZodString>;
    durationExpression: z.ZodString;
    durationPrecision: z.ZodDefault<z.ZodNumber>;
    traceIdExpression: z.ZodString;
    spanIdExpression: z.ZodString;
    parentSpanIdExpression: z.ZodString;
    spanNameExpression: z.ZodString;
    spanKindExpression: z.ZodString;
    logSourceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sessionSourceId: z.ZodOptional<z.ZodString>;
    metricSourceId: z.ZodOptional<z.ZodString>;
    statusCodeExpression: z.ZodOptional<z.ZodString>;
    statusMessageExpression: z.ZodOptional<z.ZodString>;
    serviceNameExpression: z.ZodOptional<z.ZodString>;
    resourceAttributesExpression: z.ZodOptional<z.ZodString>;
    eventAttributesExpression: z.ZodOptional<z.ZodString>;
    spanEventsValueExpression: z.ZodOptional<z.ZodString>;
    implicitColumnExpression: z.ZodOptional<z.ZodString>;
}>, "strip", z.ZodTypeAny, {
    kind: SourceKind.Trace;
    traceIdExpression: string;
    spanIdExpression: string;
    durationExpression: string;
    durationPrecision: number;
    parentSpanIdExpression: string;
    spanNameExpression: string;
    spanKindExpression: string;
    implicitColumnExpression?: string | undefined;
    defaultTableSelectExpression?: string | undefined;
    serviceNameExpression?: string | undefined;
    eventAttributesExpression?: string | undefined;
    resourceAttributesExpression?: string | undefined;
    metricSourceId?: string | undefined;
    logSourceId?: string | null | undefined;
    sessionSourceId?: string | undefined;
    statusCodeExpression?: string | undefined;
    statusMessageExpression?: string | undefined;
    spanEventsValueExpression?: string | undefined;
}, {
    kind: SourceKind.Trace;
    traceIdExpression: string;
    spanIdExpression: string;
    durationExpression: string;
    parentSpanIdExpression: string;
    spanNameExpression: string;
    spanKindExpression: string;
    implicitColumnExpression?: string | undefined;
    defaultTableSelectExpression?: string | undefined;
    serviceNameExpression?: string | undefined;
    eventAttributesExpression?: string | undefined;
    resourceAttributesExpression?: string | undefined;
    metricSourceId?: string | undefined;
    durationPrecision?: number | undefined;
    logSourceId?: string | null | undefined;
    sessionSourceId?: string | undefined;
    statusCodeExpression?: string | undefined;
    statusMessageExpression?: string | undefined;
    spanEventsValueExpression?: string | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    kind: z.ZodNativeEnum<typeof SourceKind>;
    connection: z.ZodString;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    timestampValueExpression: z.ZodString;
}, "timestampValueExpression" | "connection" | "from" | "name" | "kind" | "id">, {
    kind: z.ZodLiteral<SourceKind.Session>;
    eventAttributesExpression: z.ZodString;
    resourceAttributesExpression: z.ZodString;
    traceSourceId: z.ZodString;
    implicitColumnExpression: z.ZodOptional<z.ZodString>;
}>, "strip", z.ZodTypeAny, {
    kind: SourceKind.Session;
    eventAttributesExpression: string;
    resourceAttributesExpression: string;
    traceSourceId: string;
    implicitColumnExpression?: string | undefined;
}, {
    kind: SourceKind.Session;
    eventAttributesExpression: string;
    resourceAttributesExpression: string;
    traceSourceId: string;
    implicitColumnExpression?: string | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    kind: z.ZodNativeEnum<typeof SourceKind>;
    connection: z.ZodString;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    timestampValueExpression: z.ZodString;
}, "timestampValueExpression" | "connection" | "from" | "name" | "kind" | "id">, {
    kind: z.ZodLiteral<SourceKind.Metric>;
    from: z.ZodObject<{
        databaseName: z.ZodString;
        tableName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseName: string;
        tableName: string;
    }, {
        databaseName: string;
        tableName: string;
    }>;
    metricTables: z.ZodEffects<z.ZodObject<Record<MetricsDataType, z.ZodString>, "strip", z.ZodTypeAny, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }, {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    }>;
    resourceAttributesExpression: z.ZodString;
    logSourceId: z.ZodOptional<z.ZodString>;
}>, "strip", z.ZodTypeAny, {
    metricTables: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    };
    from: {
        databaseName: string;
        tableName: string;
    };
    kind: SourceKind.Metric;
    resourceAttributesExpression: string;
    logSourceId?: string | undefined;
}, {
    metricTables: {
        gauge: string;
        histogram: string;
        sum: string;
        summary: string;
        "exponential histogram": string;
    };
    from: {
        databaseName: string;
        tableName: string;
    };
    kind: SourceKind.Metric;
    resourceAttributesExpression: string;
    logSourceId?: string | undefined;
}>]>;
type AllKeys<T> = T extends any ? keyof T : never;
type NonOptionalKeysPresentInEveryUnionBranch<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
type RequiredInAllBranches<T, K extends AllKeys<T>> = T extends any ? K extends NonOptionalKeysPresentInEveryUnionBranch<T> ? true : false : never;
type FlattenUnion<T> = {
    [K in AllKeys<T> as RequiredInAllBranches<T, K> extends true ? K : never]: T extends infer U ? (K extends keyof U ? U[K] : never) : never;
} & {
    [K in AllKeys<T> as RequiredInAllBranches<T, K> extends true ? never : K]?: T extends infer U ? (K extends keyof U ? U[K] : never) : never;
};
type TSource = FlattenUnion<z.infer<typeof SourceSchema>>;

export { type AggregateFunction, AggregateFunctionSchema, type AggregateFunctionWithCombinators, AggregateFunctionWithCombinatorsSchema, type Alert, AlertBaseSchema, type AlertChannelType, type AlertHistory, type AlertInterval, AlertIntervalSchema, AlertSchema, AlertSource, AlertState, AlertThresholdType, ChSqlSchema, ChartAlertBaseSchema, type ChartConfig, ChartConfigSchema, type ChartConfigWithDateRange, type ChartConfigWithOptDateRange, type Connection, ConnectionSchema, type CteChartConfig, CteChartConfigSchema, DashboardSchema, DashboardWithoutIdSchema, type DateRange, type DerivedColumn, DerivedColumnSchema, DisplayType, type Filter, FilterSchema, type KeyValue, LimitSchema, type MetricTable, MetricTableSchema, MetricsDataType, type NumberFormat, NumberFormatSchema, RootValueExpressionSchema, type SQLInterval, SQLIntervalSchema, type SavedChartConfig, SavedChartConfigSchema, type SavedSearch, SavedSearchSchema, type SearchCondition, type SearchConditionLanguage, SearchConditionLanguageSchema, SearchConditionSchema, type SelectList, SelectListSchema, type SelectSQLStatement, SelectSQLStatementSchema, type SortSpecificationList, SortSpecificationListSchema, SortSpecificationSchema, SourceKind, SourceSchema, type SqlAstFilter, SqlAstFilterSchema, type StacktraceBreadcrumb, type StacktraceBreadcrumbCategory, type StacktraceFrame, type TSource, type TSourceUnion, type Tile, TileSchema, WebhookService, _ChartConfigSchema, sourceSchemaWithout, zAlertChannel, zAlertChannelType, zSavedSearchAlert, zTileAlert };
