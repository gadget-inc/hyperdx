import { SQLInterval } from './types.js';
import 'zod';

declare const isBrowser: boolean;
declare const isNode: boolean;
declare function splitAndTrimCSV(input: string): string[];
declare function splitAndTrimWithBracket(input: string): string[];
declare function getFirstTimestampValueExpression(valueExpression: string): string;
declare enum Granularity {
    FifteenSecond = "15 second",
    ThirtySecond = "30 second",
    OneMinute = "1 minute",
    FiveMinute = "5 minute",
    TenMinute = "10 minute",
    FifteenMinute = "15 minute",
    ThirtyMinute = "30 minute",
    OneHour = "1 hour",
    TwoHour = "2 hour",
    SixHour = "6 hour",
    TwelveHour = "12 hour",
    OneDay = "1 day",
    TwoDay = "2 day",
    SevenDay = "7 day",
    ThirtyDay = "30 day"
}
declare function hashCode(str: string): number;
declare function convertDateRangeToGranularityString(dateRange: [Date, Date], maxNumBuckets: number): Granularity;
declare function convertGranularityToSeconds(granularity: SQLInterval): number;
declare function toStartOfInterval(date: Date, granularity: SQLInterval): Date;
declare function timeBucketByGranularity(start: Date, end: Date, granularity: SQLInterval): Date[];
declare const _useTry: <T>(fn: () => T) => [unknown, T | null];
declare const parseJSON: <T = any>(json: string) => T | null;
declare const formatDate: (date: Date, { isUTC, format, clock, }: {
    isUTC?: boolean | undefined;
    format?: "time" | "normal" | "short" | "withMs" | undefined;
    clock?: "12h" | "24h" | undefined;
}) => string;

export { Granularity, _useTry, convertDateRangeToGranularityString, convertGranularityToSeconds, formatDate, getFirstTimestampValueExpression, hashCode, isBrowser, isNode, parseJSON, splitAndTrimCSV, splitAndTrimWithBracket, timeBucketByGranularity, toStartOfInterval };
