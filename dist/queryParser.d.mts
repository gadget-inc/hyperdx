import lucene from '@hyperdx/lucene';
import { J as JSDataType, M as Metadata } from './clickhouse-BM-O4KVb.mjs';
import '@clickhouse/client-common';
import './types.mjs';
import 'zod';

declare function parse(query: string): lucene.AST;
interface Serializer {
    operator(op: lucene.Operator): string;
    eq(field: string, term: string, isNegatedField: boolean): Promise<string>;
    isNotNull(field: string, isNegatedField: boolean): Promise<string>;
    gte(field: string, term: string): Promise<string>;
    lte(field: string, term: string): Promise<string>;
    lt(field: string, term: string): Promise<string>;
    gt(field: string, term: string): Promise<string>;
    fieldSearch(field: string, term: string, isNegatedField: boolean, prefixWildcard: boolean, suffixWildcard: boolean): Promise<string>;
    range(field: string, start: string, end: string, isNegatedField: boolean): Promise<string>;
}
declare abstract class SQLSerializer implements Serializer {
    private NOT_FOUND_QUERY;
    protected caseSensitive: boolean;
    abstract getColumnForField(field: string): Promise<{
        column?: string;
        columnJSON?: {
            string: string;
            number: string;
        };
        propertyType?: JSDataType;
        found: boolean;
    }>;
    operator(op: lucene.Operator): "AND" | "OR" | "AND NOT" | "OR NOT";
    eq(field: string, term: string, isNegatedField: boolean): Promise<string>;
    isNotNull(field: string, isNegatedField: boolean): Promise<string>;
    gte(field: string, term: string): Promise<string>;
    lte(field: string, term: string): Promise<string>;
    lt(field: string, term: string): Promise<string>;
    gt(field: string, term: string): Promise<string>;
    private attemptToParseNumber;
    private tokenizeTerm;
    private termHasSeperators;
    fieldSearch(field: string, term: string, isNegatedField: boolean, prefixWildcard: boolean, suffixWildcard: boolean): Promise<string>;
    range(field: string, start: string, end: string, isNegatedField: boolean): Promise<string>;
}
type CustomSchemaConfig = {
    databaseName: string;
    implicitColumnExpression?: string;
    fallbackAttributeExpression?: string;
    columnAliases?: Record<string, string>;
    tableName: string;
    connectionId: string;
    caseSensitive?: boolean;
};
declare class CustomSchemaSQLSerializerV2 extends SQLSerializer {
    private metadata;
    private tableName;
    private databaseName;
    private implicitColumnExpression?;
    private fallbackAttributeExpression?;
    private columnAliases;
    private connectionId;
    constructor({ metadata, databaseName, tableName, connectionId, implicitColumnExpression, fallbackAttributeExpression, columnAliases, caseSensitive, }: {
        metadata: Metadata;
    } & CustomSchemaConfig);
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
    private buildColumnExpressionFromField;
    getColumnForField(field: string): Promise<{
        column: string;
        columnJSON: undefined;
        propertyType: JSDataType;
        found: boolean;
    } | {
        column: string;
        columnJSON: {
            string: string;
            number: string;
        } | undefined;
        propertyType: JSDataType.Number | JSDataType.String | JSDataType.Bool | JSDataType.JSON | JSDataType.Dynamic | undefined;
        found: boolean;
    }>;
}
declare function genWhereSQL(ast: lucene.AST, serializer: Serializer): Promise<string>;
declare class SearchQueryBuilder {
    private readonly searchQ;
    private readonly conditions;
    private serializer;
    constructor(searchQ: string, serializer: SQLSerializer);
    setSerializer(serializer: SQLSerializer): this;
    getSerializer(): SQLSerializer;
    private genSearchQuery;
    and(condition: string): this;
    build(): Promise<string>;
}
declare function genEnglishExplanation(query: string): Promise<string>;

export { type CustomSchemaConfig, CustomSchemaSQLSerializerV2, SQLSerializer, SearchQueryBuilder, genEnglishExplanation, genWhereSQL, parse };
