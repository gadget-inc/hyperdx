import { ResponseHeaders, ResponseJSON, DataFormat, ClickHouseSettings, BaseResultSet } from '@clickhouse/client-common';
import { ChartConfigWithDateRange, ChartConfig, TSource, ChartConfigWithOptDateRange } from './types.mjs';

declare const DEFAULT_MAX_ROWS_TO_READ = 3000000;
declare class MetadataCache {
    private cache;
    private pendingQueries;
    get<T>(key: string): T | undefined;
    getOrFetch<T>(key: string, query: () => Promise<T>): Promise<T>;
    set<T>(key: string, value: T): Map<string, any>;
}
type TableMetadata = {
    database: string;
    name: string;
    uuid: string;
    engine: string;
    is_temporary: number;
    data_paths: string[];
    metadata_path: string;
    metadata_modification_time: string;
    metadata_version: number;
    create_table_query: string;
    engine_full: string;
    as_select: string;
    partition_key: string;
    sorting_key: string;
    primary_key: string;
    sampling_key: string;
    storage_policy: string;
    total_rows: string;
    total_bytes: string;
    total_bytes_uncompressed: string;
    parts: string;
    active_parts: string;
    total_marks: string;
    comment: string;
};
declare class Metadata {
    private readonly clickhouseClient;
    private readonly cache;
    constructor(clickhouseClient: ClickhouseClient, cache: MetadataCache);
    private queryTableMetadata;
    getColumns({ databaseName, tableName, connectionId, }: {
        databaseName: string;
        tableName: string;
        connectionId: string;
    }): Promise<ColumnMeta[]>;
    getMaterializedColumnsLookupTable({ databaseName, tableName, connectionId, }: {
        databaseName: string;
        tableName: string;
        connectionId: string;
    }): Promise<Map<string, string>>;
    getColumn({ databaseName, tableName, column, matchLowercase, connectionId, }: {
        databaseName: string;
        tableName: string;
        column: string;
        matchLowercase?: boolean;
        connectionId: string;
    }): Promise<ColumnMeta | undefined>;
    getMapKeys({ databaseName, tableName, column, maxKeys, connectionId, metricName, }: {
        databaseName: string;
        tableName: string;
        column: string;
        maxKeys?: number;
        connectionId: string;
        metricName?: string;
    }): Promise<string[]>;
    getMapValues({ databaseName, tableName, column, key, maxValues, connectionId, }: {
        databaseName: string;
        tableName: string;
        column: string;
        key?: string;
        maxValues?: number;
        connectionId: string;
    }): Promise<string[]>;
    getAllFields({ databaseName, tableName, connectionId, metricName, }: TableConnection): Promise<Field[]>;
    getTableMetadata({ databaseName, tableName, connectionId, }: {
        databaseName: string;
        tableName: string;
        connectionId: string;
    }): Promise<TableMetadata>;
    getKeyValues({ chartConfig, keys, limit, disableRowLimit, }: {
        chartConfig: ChartConfigWithDateRange;
        keys: string[];
        limit?: number;
        disableRowLimit?: boolean;
    }): Promise<{
        key: string;
        value: string[];
    }[]>;
}
type Field = {
    path: string[];
    type: string;
    jsType: JSDataType | null;
};
type TableConnection = {
    databaseName: string;
    tableName: string;
    connectionId: string;
    metricName?: string;
};
declare function tcFromChartConfig(config?: ChartConfig): TableConnection;
declare function tcFromSource(source?: TSource): TableConnection;
declare const getMetadata: (clickhouseClient: ClickhouseClient) => Metadata;

declare enum JSDataType {
    Array = "array",
    Date = "date",
    Map = "map",
    Number = "number",
    String = "string",
    Bool = "bool",
    JSON = "json",
    Dynamic = "dynamic"
}
declare const getResponseHeaders: (response: Response) => ResponseHeaders;
declare const convertCHDataTypeToJSType: (dataType: string) => JSDataType | null;
declare const convertCHTypeToPrimitiveJSType: (dataType: string) => JSDataType.Number | JSDataType.String | JSDataType.Bool | JSDataType.JSON | JSDataType.Dynamic | null;
type ChSql = {
    sql: string;
    params: Record<string, any>;
};
type ParamTypes = ChSql | ChSql[] | {
    Identifier: string;
} | {
    String: string;
} | {
    Float32: number;
} | {
    Float64: number;
} | {
    Int32: number;
} | {
    Int64: number;
} | {
    UNSAFE_RAW_SQL: string;
} | string;
declare const chSql: (strings: TemplateStringsArray, ...values: ParamTypes[]) => ChSql;
declare const concatChSql: (sep: string, ...args: (ChSql | ChSql[])[]) => ChSql;
declare const wrapChSqlIfNotEmpty: (sql: ChSql | ChSql[], left: string, right: string) => ChSql | [
];
declare class ClickHouseQueryError extends Error {
    query: string;
    constructor(message: string, query: string);
}
declare function extractColumnReference(sql: string, maxIterations?: number): string | null;
declare const computeRatio: (numeratorInput: string | number, denominatorInput: string | number) => number;
declare const computeResultSetRatio: (resultSet: ResponseJSON<any>) => {
    data: {
        [x: string]: any;
    }[];
    meta: {
        name: string;
        type: string;
    }[];
    query_id?: string | undefined;
    totals?: any;
    extremes?: Record<string, any> | undefined;
    statistics?: {
        elapsed: number;
        rows_read: number;
        bytes_read: number;
    } | undefined;
    rows?: number | undefined;
    rows_before_limit_at_least?: number | undefined;
};
interface QueryInputs<Format extends DataFormat> {
    query: string;
    format?: Format;
    abort_signal?: AbortSignal;
    query_params?: Record<string, any>;
    clickhouse_settings?: ClickHouseSettings;
    connectionId?: string;
    queryId?: string;
}
type ClickhouseClientOptions = {
    host: string;
    username?: string;
    password?: string;
};
declare class ClickhouseClient {
    private readonly host;
    private readonly username?;
    private readonly password?;
    private maxRowReadOnly;
    constructor({ host, username, password }: ClickhouseClientOptions);
    query<Format extends DataFormat>(props: QueryInputs<Format>): Promise<BaseResultSet<ReadableStream, Format>>;
    private __query;
    queryChartConfig({ config, metadata, opts, }: {
        config: ChartConfigWithOptDateRange;
        metadata: Metadata;
        opts?: {
            abort_signal?: AbortSignal;
            clickhouse_settings?: Record<string, any>;
        };
    }): Promise<ResponseJSON<Record<string, string | number>>>;
}
declare const testLocalConnection: ({ host, username, password, }: {
    host: string;
    username: string;
    password: string;
}) => Promise<boolean>;
declare const tableExpr: ({ database, table, }: {
    database: string;
    table: string;
}) => ChSql;
/**
 * SELECT
 *  aggFnIf(fieldToColumn(field), where),
 *  timeBucketing(Granularity, timeConversion(fieldToColumn(field))),
 * FROM db.table
 * WHERE where
 * GROUP BY timeBucketing, fieldToColumn(groupBy)
 * ORDER BY orderBy
 */
declare function parameterizedQueryToSql({ sql, params, }: {
    sql: string;
    params: Record<string, any>;
}): string;
declare function chSqlToAliasMap(chSql: ChSql | undefined): Record<string, string>;
type ColumnMetaType = {
    name: string;
    type: string;
};
declare function filterColumnMetaByType(meta: Array<ColumnMetaType>, types: JSDataType[]): Array<ColumnMetaType> | undefined;
declare function inferTimestampColumn(meta: Array<ColumnMetaType>): ColumnMetaType | undefined;
declare function inferNumericColumn(meta: Array<ColumnMetaType>): ColumnMetaType[] | undefined;
type ColumnMeta = {
    codec_expression: string;
    comment: string;
    default_expression: string;
    default_type: string;
    name: string;
    ttl_expression: string;
    type: string;
};

export { type ChSql as C, DEFAULT_MAX_ROWS_TO_READ as D, type Field as F, JSDataType as J, Metadata as M, type TableMetadata as T, MetadataCache as a, type TableConnection as b, tcFromSource as c, getResponseHeaders as d, convertCHDataTypeToJSType as e, convertCHTypeToPrimitiveJSType as f, getMetadata as g, chSql as h, concatChSql as i, ClickHouseQueryError as j, extractColumnReference as k, computeRatio as l, computeResultSetRatio as m, type ClickhouseClientOptions as n, ClickhouseClient as o, testLocalConnection as p, tableExpr as q, parameterizedQueryToSql as r, chSqlToAliasMap as s, tcFromChartConfig as t, type ColumnMetaType as u, filterColumnMetaByType as v, wrapChSqlIfNotEmpty as w, inferTimestampColumn as x, inferNumericColumn as y, type ColumnMeta as z };
