import { M as Metadata, C as ChSql } from './clickhouse-BM-O4KVb.mjs';
import { ChartConfigWithOptDateRange, ChartConfigWithDateRange, SqlAstFilter } from './types.mjs';
import '@clickhouse/client-common';
import 'zod';

declare const FIXED_TIME_BUCKET_EXPR_ALIAS = "__hdx_time_bucket";
declare function isUsingGroupBy(chartConfig: ChartConfigWithOptDateRange): chartConfig is Omit<ChartConfigWithDateRange, 'groupBy'> & {
    groupBy: NonNullable<ChartConfigWithDateRange['groupBy']>;
};
declare const isMetricChartConfig: (chartConfig: ChartConfigWithOptDateRange) => boolean;
declare const setChartSelectsAlias: (config: ChartConfigWithOptDateRange) => ChartConfigWithOptDateRange;
declare const splitChartConfigs: (config: ChartConfigWithOptDateRange) => ChartConfigWithOptDateRange[];
declare function inverseSqlAstFilter(filter: SqlAstFilter): SqlAstFilter;
declare function isNonEmptyWhereExpr(where?: string): where is string;
declare function renderChartConfig(rawChartConfig: ChartConfigWithOptDateRange, metadata: Metadata): Promise<ChSql>;

export { FIXED_TIME_BUCKET_EXPR_ALIAS, inverseSqlAstFilter, isMetricChartConfig, isNonEmptyWhereExpr, isUsingGroupBy, renderChartConfig, setChartSelectsAlias, splitChartConfigs };
