import lucene from "@hyperdx/lucene";
import SqlString from "sqlstring";
import { convertCHTypeToPrimitiveJSType, JSDataType } from "@/clickhouse";
import { splitAndTrimWithBracket } from "@/utils";
function encodeSpecialTokens(query) {
  return query.replace(/\\\\/g, "HDX_BACKSLASH_LITERAL").replace("http://", "http_COLON_//").replace("https://", "https_COLON_//").replace(/localhost:(\d{1,5})/, "localhost_COLON_$1").replace(/\\:/g, "HDX_COLON");
}
function decodeSpecialTokens(query) {
  return query.replace(/\\"/g, '"').replace(/HDX_BACKSLASH_LITERAL/g, "\\").replace("http_COLON_//", "http://").replace("https_COLON_//", "https://").replace(/localhost_COLON_(\d{1,5})/, "localhost:$1").replace(/HDX_COLON/g, ":");
}
function parse(query) {
  return lucene.parse(encodeSpecialTokens(query));
}
const IMPLICIT_FIELD = "<implicit>";
const CLICK_HOUSE_JSON_NUMBER_TYPES = [
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
class EnglishSerializer {
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
}
class SQLSerializer {
  NOT_FOUND_QUERY = "(1 = 0)";
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
    if (propertyType === JSDataType.Bool) {
      const normTerm = `${term}`.trim().toLowerCase();
      return SqlString.format(`(?? ${isNegatedField ? "!" : ""}= ?)`, [
        column,
        normTerm === "true" ? 1 : normTerm === "false" ? 0 : parseInt(normTerm)
      ]);
    } else if (propertyType === JSDataType.Number) {
      return SqlString.format(
        `(${column} ${isNegatedField ? "!" : ""}= CAST(?, 'Float64'))`,
        [term]
      );
    } else if (propertyType === JSDataType.JSON) {
      return SqlString.format(
        `(${columnJSON?.string} ${isNegatedField ? "!" : ""}= ?)`,
        [term]
      );
    }
    return SqlString.format(`(${column} ${isNegatedField ? "!" : ""}= ?)`, [
      term
    ]);
  }
  async isNotNull(field, isNegatedField) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === JSDataType.JSON) {
      return `notEmpty(${columnJSON?.string}) ${isNegatedField ? "!" : ""}= 1`;
    }
    return `notEmpty(${column}) ${isNegatedField ? "!" : ""}= 1`;
  }
  async gte(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === JSDataType.JSON) {
      return SqlString.format(`(${columnJSON?.number} >= ?)`, [term]);
    }
    return SqlString.format(`(${column} >= ?)`, [term]);
  }
  async lte(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === JSDataType.JSON) {
      return SqlString.format(`(${columnJSON?.number} <= ?)`, [term]);
    }
    return SqlString.format(`(${column} <= ?)`, [term]);
  }
  async lt(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === JSDataType.JSON) {
      return SqlString.format(`(${columnJSON?.number} < ?)`, [term]);
    }
    return SqlString.format(`(${column} < ?)`, [term]);
  }
  async gt(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === JSDataType.JSON) {
      return SqlString.format(`(${columnJSON?.number} > ?)`, [term]);
    }
    return SqlString.format(`(${column} > ?)`, [term]);
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
    if (propertyType === JSDataType.Bool) {
      const normTerm = `${term}`.trim().toLowerCase();
      return SqlString.format(`(?? ${isNegatedField ? "!" : ""}= ?)`, [
        column,
        normTerm === "true" ? 1 : normTerm === "false" ? 0 : parseInt(normTerm)
      ]);
    } else if (propertyType === JSDataType.Number) {
      return SqlString.format(
        `(?? ${isNegatedField ? "!" : ""}= CAST(?, 'Float64'))`,
        [column, term]
      );
    } else if (propertyType === JSDataType.JSON) {
      return SqlString.format(
        `(${columnJSON?.string} ${isNegatedField ? "NOT " : ""}ILIKE ?)`,
        [`%${term}%`]
      );
    }
    if (term.length === 0) {
      return "(1=1)";
    }
    if (isImplicitField) {
      if (prefixWildcard || suffixWildcard) {
        return SqlString.format(
          `(lower(?) ${isNegatedField ? "NOT " : ""}LIKE lower(?))`,
          [
            SqlString.raw(column ?? ""),
            `${prefixWildcard ? "%" : ""}${term}${suffixWildcard ? "%" : ""}`
          ]
        );
      } else {
        const hasSeperators = this.termHasSeperators(term);
        if (hasSeperators) {
          const tokens = this.tokenizeTerm(term);
          return `(${isNegatedField ? "NOT (" : ""}${[
            ...tokens.map(
              (token) => SqlString.format(`hasTokenCaseInsensitive(?, ?)`, [
                SqlString.raw(column ?? ""),
                token
              ])
            ),
            // If there are symbols in the term, we'll try to match the whole term as well (ex. Scott!)
            SqlString.format(`(lower(?) LIKE lower(?))`, [
              SqlString.raw(column ?? ""),
              `%${term}%`
            ])
          ].join(" AND ")}${isNegatedField ? ")" : ""})`;
        } else {
          return SqlString.format(
            `(${isNegatedField ? "NOT " : ""}hasTokenCaseInsensitive(?, ?))`,
            [SqlString.raw(column ?? ""), term]
          );
        }
      }
    } else {
      const shoudUseTokenBf = isImplicitField;
      return SqlString.format(
        `(${column} ${isNegatedField ? "NOT " : ""}? ?)`,
        [SqlString.raw(shoudUseTokenBf ? "LIKE" : "ILIKE"), `%${term}%`]
      );
    }
  }
  async range(field, start, end, isNegatedField) {
    const { column, found } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    return SqlString.format(
      `(${column} ${isNegatedField ? "NOT " : ""}BETWEEN ? AND ?)`,
      [this.attemptToParseNumber(start), this.attemptToParseNumber(end)]
    );
  }
}
class CustomSchemaSQLSerializerV2 extends SQLSerializer {
  metadata;
  tableName;
  databaseName;
  implicitColumnExpression;
  fallbackAttributeExpression;
  columnAliases;
  connectionId;
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
    this.columnAliases = columnAliases ?? {};
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
            string: SqlString.format(`toString(??)`, [exactMatch.name]),
            number: SqlString.format(`dynamicType(??) in (?) and ??`, [
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
        const valueType = prefixMatch.type.match(/,\s+(\w+)\)$/)?.[1];
        return {
          found: true,
          columnExpression: SqlString.format(`??[?]`, [
            prefixMatch.name,
            fieldPostfix
          ]),
          columnType: valueType ?? "Unknown"
        };
      } else if (prefixMatch.type.startsWith("JSON")) {
        const jsonFieldPath = fieldPostfix ? `${prefixMatch.name}.${fieldPostfix}` : prefixMatch.name;
        return {
          found: true,
          columnExpression: "",
          columnExpressionJSON: {
            string: SqlString.format(`toString(??)`, [jsonFieldPath]),
            number: SqlString.format(`dynamicType(??) in (?) and ??`, [
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
          columnExpression: SqlString.format(
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
          string: SqlString.format(`toString(??)`, [accessPath]),
          number: SqlString.format(`dynamicType(??) in (?) and ??`, [
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
      const expressions = splitAndTrimWithBracket(
        this.implicitColumnExpression
      );
      return {
        column: expressions.length > 1 ? `concatWithSeparator(';',${expressions.join(",")})` : this.implicitColumnExpression,
        columnJSON: void 0,
        propertyType: JSDataType.String,
        found: true
      };
    }
    const expression = await this.buildColumnExpressionFromField(field);
    return {
      column: expression.columnExpression,
      columnJSON: expression?.columnExpressionJSON,
      propertyType: convertCHTypeToPrimitiveJSType(expression.columnType) ?? void 0,
      found: expression.found
    };
  }
}
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
class SearchQueryBuilder {
  searchQ;
  conditions;
  serializer;
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
}
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
export {
  CustomSchemaSQLSerializerV2,
  SQLSerializer,
  SearchQueryBuilder,
  genEnglishExplanation,
  genWhereSQL,
  parse
};
