"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _lucene = require('@hyperdx/lucene'); var _lucene2 = _interopRequireDefault(_lucene);
var _sqlstring = require('sqlstring'); var _sqlstring2 = _interopRequireDefault(_sqlstring);
var _clickhouse = require('@/clickhouse');
var _utils = require('@/utils');
function encodeSpecialTokens(query) {
  return query.replace(/\\\\/g, "HDX_BACKSLASH_LITERAL").replace("http://", "http_COLON_//").replace("https://", "https_COLON_//").replace(/localhost:(\d{1,5})/, "localhost_COLON_$1").replace(/\\:/g, "HDX_COLON");
}
function decodeSpecialTokens(query) {
  return query.replace(/\\"/g, '"').replace(/HDX_BACKSLASH_LITERAL/g, "\\").replace("http_COLON_//", "http://").replace("https_COLON_//", "https://").replace(/localhost_COLON_(\d{1,5})/, "localhost:$1").replace(/HDX_COLON/g, ":");
}
function parse(query) {
  return _lucene2.default.parse(encodeSpecialTokens(query));
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
class SQLSerializer {constructor() { SQLSerializer.prototype.__init.call(this); }
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
    if (propertyType === _clickhouse.JSDataType.Bool) {
      const normTerm = `${term}`.trim().toLowerCase();
      return _sqlstring2.default.format(`(?? ${isNegatedField ? "!" : ""}= ?)`, [
        column,
        normTerm === "true" ? 1 : normTerm === "false" ? 0 : parseInt(normTerm)
      ]);
    } else if (propertyType === _clickhouse.JSDataType.Number) {
      return _sqlstring2.default.format(
        `(${column} ${isNegatedField ? "!" : ""}= CAST(?, 'Float64'))`,
        [term]
      );
    } else if (propertyType === _clickhouse.JSDataType.JSON) {
      return _sqlstring2.default.format(
        `(${_optionalChain([columnJSON, 'optionalAccess', _ => _.string])} ${isNegatedField ? "!" : ""}= ?)`,
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
    if (propertyType === _clickhouse.JSDataType.JSON) {
      return `notEmpty(${_optionalChain([columnJSON, 'optionalAccess', _2 => _2.string])}) ${isNegatedField ? "!" : ""}= 1`;
    }
    return `notEmpty(${column}) ${isNegatedField ? "!" : ""}= 1`;
  }
  async gte(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === _clickhouse.JSDataType.JSON) {
      return _sqlstring2.default.format(`(${_optionalChain([columnJSON, 'optionalAccess', _3 => _3.number])} >= ?)`, [term]);
    }
    return _sqlstring2.default.format(`(${column} >= ?)`, [term]);
  }
  async lte(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === _clickhouse.JSDataType.JSON) {
      return _sqlstring2.default.format(`(${_optionalChain([columnJSON, 'optionalAccess', _4 => _4.number])} <= ?)`, [term]);
    }
    return _sqlstring2.default.format(`(${column} <= ?)`, [term]);
  }
  async lt(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === _clickhouse.JSDataType.JSON) {
      return _sqlstring2.default.format(`(${_optionalChain([columnJSON, 'optionalAccess', _5 => _5.number])} < ?)`, [term]);
    }
    return _sqlstring2.default.format(`(${column} < ?)`, [term]);
  }
  async gt(field, term) {
    const { column, columnJSON, found, propertyType } = await this.getColumnForField(field);
    if (!found) {
      return this.NOT_FOUND_QUERY;
    }
    if (propertyType === _clickhouse.JSDataType.JSON) {
      return _sqlstring2.default.format(`(${_optionalChain([columnJSON, 'optionalAccess', _6 => _6.number])} > ?)`, [term]);
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
    if (propertyType === _clickhouse.JSDataType.Bool) {
      const normTerm = `${term}`.trim().toLowerCase();
      return _sqlstring2.default.format(`(?? ${isNegatedField ? "!" : ""}= ?)`, [
        column,
        normTerm === "true" ? 1 : normTerm === "false" ? 0 : parseInt(normTerm)
      ]);
    } else if (propertyType === _clickhouse.JSDataType.Number) {
      return _sqlstring2.default.format(
        `(?? ${isNegatedField ? "!" : ""}= CAST(?, 'Float64'))`,
        [column, term]
      );
    } else if (propertyType === _clickhouse.JSDataType.JSON) {
      return _sqlstring2.default.format(
        `(${_optionalChain([columnJSON, 'optionalAccess', _7 => _7.string])} ${isNegatedField ? "NOT " : ""}ILIKE ?)`,
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
}
class CustomSchemaSQLSerializerV2 extends SQLSerializer {
  
  
  
  
  
  
  
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
        const valueType = _optionalChain([prefixMatch, 'access', _8 => _8.type, 'access', _9 => _9.match, 'call', _10 => _10(/,\s+(\w+)\)$/), 'optionalAccess', _11 => _11[1]]);
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
      const expressions = _utils.splitAndTrimWithBracket.call(void 0, 
        this.implicitColumnExpression
      );
      return {
        column: expressions.length > 1 ? `concatWithSeparator(';',${expressions.join(",")})` : this.implicitColumnExpression,
        columnJSON: void 0,
        propertyType: _clickhouse.JSDataType.String,
        found: true
      };
    }
    const expression = await this.buildColumnExpressionFromField(field);
    return {
      column: expression.columnExpression,
      columnJSON: _optionalChain([expression, 'optionalAccess', _12 => _12.columnExpressionJSON]),
      propertyType: _nullishCoalesce(_clickhouse.convertCHTypeToPrimitiveJSType.call(void 0, expression.columnType), () => ( void 0)),
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







exports.CustomSchemaSQLSerializerV2 = CustomSchemaSQLSerializerV2; exports.SQLSerializer = SQLSerializer; exports.SearchQueryBuilder = SearchQueryBuilder; exports.genEnglishExplanation = genEnglishExplanation; exports.genWhereSQL = genWhereSQL; exports.parse = parse;
