import { add as fnsAdd, format as fnsFormat } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
function splitAndTrimCSV(input) {
  return input.split(",").map((column) => column.trim()).filter((column) => column.length > 0);
}
function splitAndTrimWithBracket(input) {
  let parenCount = 0;
  let squareCount = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  const res = [];
  let cur = "";
  for (const c of input + ",") {
    if (c === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      cur += c;
      continue;
    }
    if (c === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      cur += c;
      continue;
    }
    if (!inSingleQuote && !inDoubleQuote) {
      if (c === "(") {
        parenCount++;
      } else if (c === ")") {
        parenCount--;
      } else if (c === "[") {
        squareCount++;
      } else if (c === "]") {
        squareCount--;
      }
    }
    if (c === "," && parenCount === 0 && squareCount === 0 && !inSingleQuote && !inDoubleQuote) {
      const trimString = cur.trim();
      if (trimString) res.push(trimString);
      cur = "";
    } else {
      cur += c;
    }
  }
  return res;
}
function getFirstTimestampValueExpression(valueExpression) {
  return splitAndTrimWithBracket(valueExpression)[0];
}
var Granularity = /* @__PURE__ */ ((Granularity2) => {
  Granularity2["FifteenSecond"] = "15 second";
  Granularity2["ThirtySecond"] = "30 second";
  Granularity2["OneMinute"] = "1 minute";
  Granularity2["FiveMinute"] = "5 minute";
  Granularity2["TenMinute"] = "10 minute";
  Granularity2["FifteenMinute"] = "15 minute";
  Granularity2["ThirtyMinute"] = "30 minute";
  Granularity2["OneHour"] = "1 hour";
  Granularity2["TwoHour"] = "2 hour";
  Granularity2["SixHour"] = "6 hour";
  Granularity2["TwelveHour"] = "12 hour";
  Granularity2["OneDay"] = "1 day";
  Granularity2["TwoDay"] = "2 day";
  Granularity2["SevenDay"] = "7 day";
  Granularity2["ThirtyDay"] = "30 day";
  return Granularity2;
})(Granularity || {});
function hashCode(str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}
function convertDateRangeToGranularityString(dateRange, maxNumBuckets) {
  const start = dateRange[0].getTime();
  const end = dateRange[1].getTime();
  const diffSeconds = Math.floor((end - start) / 1e3);
  const granularitySizeSeconds = Math.ceil(diffSeconds / maxNumBuckets);
  if (granularitySizeSeconds <= 15) {
    return "15 second" /* FifteenSecond */;
  } else if (granularitySizeSeconds <= 30) {
    return "30 second" /* ThirtySecond */;
  } else if (granularitySizeSeconds <= 60) {
    return "1 minute" /* OneMinute */;
  } else if (granularitySizeSeconds <= 5 * 60) {
    return "5 minute" /* FiveMinute */;
  } else if (granularitySizeSeconds <= 10 * 60) {
    return "10 minute" /* TenMinute */;
  } else if (granularitySizeSeconds <= 15 * 60) {
    return "15 minute" /* FifteenMinute */;
  } else if (granularitySizeSeconds <= 30 * 60) {
    return "30 minute" /* ThirtyMinute */;
  } else if (granularitySizeSeconds <= 3600) {
    return "1 hour" /* OneHour */;
  } else if (granularitySizeSeconds <= 2 * 3600) {
    return "2 hour" /* TwoHour */;
  } else if (granularitySizeSeconds <= 6 * 3600) {
    return "6 hour" /* SixHour */;
  } else if (granularitySizeSeconds <= 12 * 3600) {
    return "12 hour" /* TwelveHour */;
  } else if (granularitySizeSeconds <= 24 * 3600) {
    return "1 day" /* OneDay */;
  } else if (granularitySizeSeconds <= 2 * 24 * 3600) {
    return "2 day" /* TwoDay */;
  } else if (granularitySizeSeconds <= 7 * 24 * 3600) {
    return "7 day" /* SevenDay */;
  } else if (granularitySizeSeconds <= 30 * 24 * 3600) {
    return "30 day" /* ThirtyDay */;
  }
  return "30 day" /* ThirtyDay */;
}
function convertGranularityToSeconds(granularity) {
  const [num, unit] = granularity.split(" ");
  const numInt = Number.parseInt(num);
  switch (unit) {
    case "second":
      return numInt;
    case "minute":
      return numInt * 60;
    case "hour":
      return numInt * 60 * 60;
    case "day":
      return numInt * 60 * 60 * 24;
    default:
      return 0;
  }
}
function toStartOfInterval(date, granularity) {
  const [num, unit] = granularity.split(" ");
  const numInt = Number.parseInt(num);
  const roundFn = Math.floor;
  switch (unit) {
    case "second":
      return new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          date.getUTCMinutes(),
          roundFn(date.getUTCSeconds() / numInt) * numInt
        )
      );
    case "minute":
      return new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          roundFn(date.getUTCMinutes() / numInt) * numInt
        )
      );
    case "hour":
      return new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          roundFn(date.getUTCHours() / numInt) * numInt
        )
      );
    case "day": {
      const daysSinceEpoch = date.getTime() / 1e3 / 60 / 60 / 24;
      const daysSinceEpochRounded = roundFn(daysSinceEpoch / numInt) * numInt;
      return new Date(daysSinceEpochRounded * 1e3 * 60 * 60 * 24);
    }
    default:
      return date;
  }
}
function timeBucketByGranularity(start, end, granularity) {
  const buckets = [];
  let current = toStartOfInterval(start, granularity);
  const granularitySeconds = convertGranularityToSeconds(granularity);
  while (current < end) {
    buckets.push(current);
    current = fnsAdd(current, {
      seconds: granularitySeconds
    });
  }
  return buckets;
}
const _useTry = (fn) => {
  let output = null;
  let error = null;
  try {
    output = fn();
    return [error, output];
  } catch (e) {
    error = e;
    return [error, output];
  }
};
const parseJSON = (json) => {
  const [error, result] = _useTry(() => JSON.parse(json));
  return result;
};
const TIME_TOKENS = {
  normal: {
    "12h": "MMM d h:mm:ss a",
    "24h": "MMM d HH:mm:ss"
  },
  short: {
    "12h": "MMM d h:mma",
    "24h": "MMM d HH:mm"
  },
  withMs: {
    "12h": "MMM d h:mm:ss.SSS a",
    "24h": "MMM d HH:mm:ss.SSS"
  },
  time: {
    "12h": "h:mm:ss a",
    "24h": "HH:mm:ss"
  }
};
const formatDate = (date, {
  isUTC = false,
  format = "normal",
  clock = "12h"
}) => {
  const formatStr = TIME_TOKENS[format][clock];
  return isUTC ? formatInTimeZone(date, "Etc/UTC", formatStr) : fnsFormat(date, formatStr);
};
export {
  Granularity,
  _useTry,
  convertDateRangeToGranularityString,
  convertGranularityToSeconds,
  formatDate,
  getFirstTimestampValueExpression,
  hashCode,
  isBrowser,
  isNode,
  parseJSON,
  splitAndTrimCSV,
  splitAndTrimWithBracket,
  timeBucketByGranularity,
  toStartOfInterval
};
