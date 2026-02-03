import { ClickhouseClient } from '@/clickhouse';
import { getMetadata } from '@/metadata';
import { CustomSchemaSQLSerializerV2 } from '@/queryParser';

describe('CustomSchemaSQLSerializerV2 - json', () => {
  function getTestTable(field) {
    return { name: field, type: 'JSON' };
  }
  const metadata = getMetadata(new ClickhouseClient({ host: '' }));
  // @ts-ignore
  metadata.getColumn = ({ column }) => {
    return new Promise((resolve, reject) => {
      if (column.indexOf('.') >= 0) return resolve(undefined);
      if (column === 'someUnknownField') return resolve(undefined);
      const testTable = getTestTable(column);
      // @ts-ignore
      return resolve(testTable);
    });
  };
  const databaseName = 'testName';
  const tableName = 'testTable';
  const connectionId = 'testId';
  const serializer = new CustomSchemaSQLSerializerV2({
    metadata,
    databaseName,
    tableName,
    connectionId,
  });

  it('getColumnForField', async () => {
    const field1 = 'serviceName.test';
    const res1 = await serializer.getColumnForField(field1);
    expect(res1).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`serviceName`.`test`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `serviceName`.`test`",
        string: 'toString(`serviceName`.`test`)',
      },
      found: true,
      propertyType: 'json',
    });
    const field2 = 'logBody.test.nest';
    const res2 = await serializer.getColumnForField(field2);
    expect(res2).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`logBody`.`test`.`nest`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `logBody`.`test`.`nest`",
        string: 'toString(`logBody`.`test`.`nest`)',
      },
      found: true,
      propertyType: 'json',
    });
  });

  it('getColumnForField - fallbackAttributeExpression', async () => {
    const serializer = new CustomSchemaSQLSerializerV2({
      metadata,
      databaseName,
      tableName,
      connectionId,
      fallbackAttributeExpression: 'LogAttributes',
    });

    const field1 = 'someUnknownField';
    const res1 = await serializer.getColumnForField(field1);
    expect(res1).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`LogAttributes`.`someUnknownField`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `LogAttributes`.`someUnknownField`",
        string: 'toString(`LogAttributes`.`someUnknownField`)',
      },
      found: true,
      propertyType: 'json',
    });
    const field2 = 'someUnknownField.test.nest';
    const res2 = await serializer.getColumnForField(field2);
    expect(res2).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`LogAttributes`.`someUnknownField`.`test`.`nest`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `LogAttributes`.`someUnknownField`.`test`.`nest`",
        string: 'toString(`LogAttributes`.`someUnknownField`.`test`.`nest`)',
      },
      found: true,
      propertyType: 'json',
    });

    const field3 = `someUnknownField.test-special-char';.nest`;
    const res3 = await serializer.getColumnForField(field3);
    expect(res3).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`LogAttributes`.`someUnknownField`.`test-special-char';`.`nest`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `LogAttributes`.`someUnknownField`.`test-special-char';`.`nest`",
        string:
          "toString(`LogAttributes`.`someUnknownField`.`test-special-char';`.`nest`)",
      },
      found: true,
      propertyType: 'json',
    });
  });

  it('compare - eq, isNotNull, gte, lte, lt, gt', async () => {
    const eqField = 'serviceName.eq.test';
    const eqTerm = 'testTerm';
    const eq1 = await serializer.eq(eqField, eqTerm, false);
    expect(eq1).toBe("(toString(`serviceName`.`eq`.`test`) = 'testTerm')");
    const eq2 = await serializer.eq(eqField, eqTerm, true);
    expect(eq2).toBe("(toString(`serviceName`.`eq`.`test`) != 'testTerm')");
  });

  it('compare - isNotNull', async () => {
    const isNotNullField = 'serviceName.isNotNull.test';
    const isNotNull1 = await serializer.isNotNull(isNotNullField, false);
    expect(isNotNull1).toBe(
      'notEmpty(toString(`serviceName`.`isNotNull`.`test`)) = 1',
    );
    const isNotNull2 = await serializer.isNotNull(isNotNullField, true);
    expect(isNotNull2).toBe(
      'notEmpty(toString(`serviceName`.`isNotNull`.`test`)) != 1',
    );
  });

  it('compare - gte', async () => {
    const gteField = 'serviceName.gte.test';
    const gteTerm = '30';
    const gte = await serializer.gte(gteField, gteTerm);
    expect(gte).toBe(
      "(dynamicType(`serviceName`.`gte`.`test`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `serviceName`.`gte`.`test` >= '30')",
    );
  });

  it('compare - lte', async () => {
    const lteField = 'serviceName.lte.test';
    const lteTerm = '40';
    const lte = await serializer.lte(lteField, lteTerm);
    expect(lte).toBe(
      "(dynamicType(`serviceName`.`lte`.`test`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `serviceName`.`lte`.`test` <= '40')",
    );
  });

  it('compare - gt', async () => {
    const gtField = 'serviceName.gt.test';
    const gtTerm = '70';
    const gt = await serializer.gt(gtField, gtTerm);
    expect(gt).toBe(
      "(dynamicType(`serviceName`.`gt`.`test`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `serviceName`.`gt`.`test` > '70')",
    );
  });

  it('compare - lt', async () => {
    const ltField = 'serviceName.lt.test';
    const ltTerm = '2';
    const lt = await serializer.lt(ltField, ltTerm);
    expect(lt).toBe(
      "(dynamicType(`serviceName`.`lt`.`test`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `serviceName`.`lt`.`test` < '2')",
    );
  });

  it('columnAliases - maps field prefixes to actual column names', async () => {
    // Mock metadata to return different column types for testing
    const mockMetadata = getMetadata(new ClickhouseClient({ host: '' }));
    // @ts-ignore
    mockMetadata.getColumn = ({ column }) => {
      return new Promise((resolve, reject) => {
        if (column.indexOf('.') >= 0) return resolve(undefined);

        // Mock different column types for testing
        if (column === 'actualServiceName') {
          return resolve({
            name: 'actualServiceName',
            type: 'JSON',
            codec_expression: '',
            comment: '',
            default_expression: '',
            default_type: '',
            ttl_expression: '',
          });
        }
        if (column === 'actualLogLevel') {
          return resolve({
            name: 'actualLogLevel',
            type: 'String',
            codec_expression: '',
            comment: '',
            default_expression: '',
            default_type: '',
            ttl_expression: '',
          });
        }
        if (column === 'actualUserId') {
          return resolve({
            name: 'actualUserId',
            type: 'Map(String, String)',
            codec_expression: '',
            comment: '',
            default_expression: '',
            default_type: '',
            ttl_expression: '',
          });
        }
        if (column === 'someUnknownField') return resolve(undefined);
        if (column === 'service') return resolve(undefined);
        if (column === 'level') return resolve(undefined);
        if (column === 'user') return resolve(undefined);

        const testTable = getTestTable(column);
        // @ts-ignore
        return resolve(testTable);
      });
    };

    const columnAliases = {
      service: 'actualServiceName',
      level: 'actualLogLevel',
      user: 'actualUserId',
    };

    const serializerWithAliases = new CustomSchemaSQLSerializerV2({
      metadata: mockMetadata,
      databaseName,
      tableName,
      connectionId,
      columnAliases,
    });

    // Test JSON column alias
    const jsonField = 'service.status';
    const jsonResult = await serializerWithAliases.getColumnForField(jsonField);
    expect(jsonResult).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`actualServiceName`.`status`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `actualServiceName`.`status`",
        string: 'toString(`actualServiceName`.`status`)',
      },
      found: true,
      propertyType: 'json',
    });

    // Test String column alias with JSONExtractString
    const stringField = 'level.detail';
    const stringResult =
      await serializerWithAliases.getColumnForField(stringField);
    expect(stringResult).toEqual({
      column: "JSONExtractString(`actualLogLevel`, 'detail')",
      columnJSON: undefined,
      found: true,
      propertyType: 'string',
    });

    // Test Map column alias
    const mapField = 'user.preferences';
    const mapResult = await serializerWithAliases.getColumnForField(mapField);
    expect(mapResult).toEqual({
      column: "`actualUserId`['preferences']",
      columnJSON: undefined,
      found: true,
      propertyType: 'string',
    });

    // Test that non-aliased fields still work normally
    const normalField = 'logBody.test';
    const normalResult =
      await serializerWithAliases.getColumnForField(normalField);
    expect(normalResult).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`logBody`.`test`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `logBody`.`test`",
        string: 'toString(`logBody`.`test`)',
      },
      found: true,
      propertyType: 'json',
    });

    // Test that unknown fields with aliases fall back to the alias column
    const unknownField = 'service.unknownProperty';
    const unknownResult =
      await serializerWithAliases.getColumnForField(unknownField);
    expect(unknownResult).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`actualServiceName`.`unknownProperty`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `actualServiceName`.`unknownProperty`",
        string: 'toString(`actualServiceName`.`unknownProperty`)',
      },
      found: true,
      propertyType: 'json',
    });

    // Test exact field name aliases
    const exactFieldAlias = 'service';
    const exactFieldResult =
      await serializerWithAliases.getColumnForField(exactFieldAlias);
    expect(exactFieldResult).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`actualServiceName`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `actualServiceName`",
        string: 'toString(`actualServiceName`)',
      },
      found: true,
      propertyType: 'json',
    });

    // Test exact field name alias with different column type
    const exactStringAlias = 'level';
    const exactStringResult =
      await serializerWithAliases.getColumnForField(exactStringAlias);
    expect(exactStringResult).toEqual({
      column: 'actualLogLevel',
      columnJSON: undefined,
      found: true,
      propertyType: 'string',
    });
  });

  it('columnAliases - works with comparison operations', async () => {
    const mockMetadata = getMetadata(new ClickhouseClient({ host: '' }));
    // @ts-ignore
    mockMetadata.getColumn = ({ column }) => {
      return new Promise((resolve, reject) => {
        if (column.indexOf('.') >= 0) return resolve(undefined);
        if (column === 'actualStatus') {
          return resolve({
            name: 'actualStatus',
            type: 'JSON',
            codec_expression: '',
            comment: '',
            default_expression: '',
            default_type: '',
            ttl_expression: '',
          });
        }
        if (column === 'someUnknownField') return resolve(undefined);
        if (column === 'status') return resolve(undefined);

        const testTable = getTestTable(column);
        // @ts-ignore
        return resolve(testTable);
      });
    };

    const columnAliases = {
      status: 'actualStatus',
    };

    const serializerWithAliases = new CustomSchemaSQLSerializerV2({
      metadata: mockMetadata,
      databaseName,
      tableName,
      connectionId,
      columnAliases,
    });

    // Test eq operation with alias
    const eqField = 'status.value';
    const eqTerm = 'active';
    const eqResult = await serializerWithAliases.eq(eqField, eqTerm, false);
    expect(eqResult).toBe("(toString(`actualStatus`.`value`) = 'active')");

    // Test gte operation with alias
    const gteField = 'status.count';
    const gteTerm = '10';
    const gteResult = await serializerWithAliases.gte(gteField, gteTerm);
    expect(gteResult).toBe(
      "(dynamicType(`actualStatus`.`count`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `actualStatus`.`count` >= '10')",
    );

    // Test isNotNull operation with alias
    const isNotNullField = 'status.detail';
    const isNotNullResult = await serializerWithAliases.isNotNull(
      isNotNullField,
      false,
    );
    expect(isNotNullResult).toBe(
      'notEmpty(toString(`actualStatus`.`detail`)) = 1',
    );

    // Test exact field name alias in comparison operations
    const exactField = 'status';
    const exactFieldResult = await serializerWithAliases.eq(
      exactField,
      'active',
      false,
    );
    expect(exactFieldResult).toBe("(toString(`actualStatus`) = 'active')");
  });

  it('columnAliases - empty aliases object works correctly', async () => {
    const serializerWithEmptyAliases = new CustomSchemaSQLSerializerV2({
      metadata,
      databaseName,
      tableName,
      connectionId,
      columnAliases: {},
    });

    // Should work the same as without columnAliases
    const field = 'serviceName.test';
    const result = await serializerWithEmptyAliases.getColumnForField(field);
    expect(result).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`serviceName`.`test`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `serviceName`.`test`",
        string: 'toString(`serviceName`.`test`)',
      },
      found: true,
      propertyType: 'json',
    });
  });

  it('columnAliases - undefined aliases works correctly', async () => {
    const serializerWithUndefinedAliases = new CustomSchemaSQLSerializerV2({
      metadata,
      databaseName,
      tableName,
      connectionId,
      // columnAliases is undefined
    });

    // Should work the same as without columnAliases
    const field = 'serviceName.test';
    const result =
      await serializerWithUndefinedAliases.getColumnForField(field);
    expect(result).toEqual({
      column: '',
      columnJSON: {
        number:
          "dynamicType(`serviceName`.`test`) in ('Int8', 'Int16', 'Int32', 'Int64', 'Int128', 'Int256', 'UInt8', 'UInt16', 'UInt32', 'UInt64', 'UInt128', 'UInt256', 'Float32', 'Float64') and `serviceName`.`test`",
        string: 'toString(`serviceName`.`test`)',
      },
      found: true,
      propertyType: 'json',
    });
  });

  describe('caseSensitive', () => {
    const mockMetadata = getMetadata(new ClickhouseClient({ host: '' }));
    // @ts-ignore
    mockMetadata.getColumn = ({ column }) => {
      return new Promise(resolve => {
        if (column.indexOf('.') >= 0) return resolve(undefined);
        if (column === 'Body') {
          return resolve({
            name: 'Body',
            type: 'String',
            codec_expression: '',
            comment: '',
            default_expression: '',
            default_type: '',
            ttl_expression: '',
          });
        }
        const testTable = getTestTable(column);
        // @ts-ignore
        return resolve(testTable);
      });
    };

    const caseSensitiveSerializer = new CustomSchemaSQLSerializerV2({
      metadata: mockMetadata,
      databaseName,
      tableName,
      connectionId,
      implicitColumnExpression: 'Body',
      caseSensitive: true,
    });

    const caseInsensitiveSerializer = new CustomSchemaSQLSerializerV2({
      metadata: mockMetadata,
      databaseName,
      tableName,
      connectionId,
      implicitColumnExpression: 'Body',
      caseSensitive: false,
    });

    it('implicit field - single token uses hasToken when caseSensitive', async () => {
      const result = await caseSensitiveSerializer.fieldSearch(
        '<implicit>',
        'error',
        false,
        false,
        false,
      );
      expect(result).toBe("(hasToken(Body, 'error'))");
    });

    it('implicit field - single token uses hasTokenCaseInsensitive when not caseSensitive', async () => {
      const result = await caseInsensitiveSerializer.fieldSearch(
        '<implicit>',
        'error',
        false,
        false,
        false,
      );
      expect(result).toBe("(hasTokenCaseInsensitive(Body, 'error'))");
    });

    it('implicit field - wildcard uses LIKE without lower() when caseSensitive', async () => {
      const result = await caseSensitiveSerializer.fieldSearch(
        '<implicit>',
        'err',
        false,
        false,
        true,
      );
      expect(result).toBe("(Body LIKE 'err%')");
    });

    it('implicit field - wildcard uses lower() LIKE lower() when not caseSensitive', async () => {
      const result = await caseInsensitiveSerializer.fieldSearch(
        '<implicit>',
        'err',
        false,
        false,
        true,
      );
      expect(result).toBe("(lower(Body) LIKE lower('err%'))");
    });

    it('implicit field - tokens with separators uses hasToken when caseSensitive', async () => {
      const result = await caseSensitiveSerializer.fieldSearch(
        '<implicit>',
        'hello world',
        false,
        false,
        false,
      );
      expect(result).toContain("hasToken(Body, 'hello')");
      expect(result).toContain("hasToken(Body, 'world')");
      expect(result).toContain("(Body LIKE '%hello world%')");
      expect(result).not.toContain('hasTokenCaseInsensitive');
      expect(result).not.toContain('lower');
    });

    it('implicit field - tokens with separators uses hasTokenCaseInsensitive when not caseSensitive', async () => {
      const result = await caseInsensitiveSerializer.fieldSearch(
        '<implicit>',
        'hello world',
        false,
        false,
        false,
      );
      expect(result).toContain("hasTokenCaseInsensitive(Body, 'hello')");
      expect(result).toContain("hasTokenCaseInsensitive(Body, 'world')");
      expect(result).toContain("(lower(Body) LIKE lower('%hello world%'))");
      expect(result).not.toContain('hasToken(');
    });

    it('JSON field uses LIKE when caseSensitive', async () => {
      const result = await caseSensitiveSerializer.fieldSearch(
        'serviceName',
        'myService',
        false,
        false,
        false,
      );
      expect(result).toBe(
        "(toString(`serviceName`) LIKE '%myService%')",
      );
    });

    it('JSON field uses ILIKE when not caseSensitive', async () => {
      const result = await caseInsensitiveSerializer.fieldSearch(
        'serviceName',
        'myService',
        false,
        false,
        false,
      );
      expect(result).toBe(
        "(toString(`serviceName`) ILIKE '%myService%')",
      );
    });

    it('non-implicit String field uses LIKE when caseSensitive', async () => {
      const result = await caseSensitiveSerializer.fieldSearch(
        'Body',
        'myTerm',
        false,
        false,
        false,
      );
      expect(result).toBe("(Body LIKE '%myTerm%')");
    });

    it('non-implicit String field uses ILIKE when not caseSensitive', async () => {
      const result = await caseInsensitiveSerializer.fieldSearch(
        'Body',
        'myTerm',
        false,
        false,
        false,
      );
      expect(result).toBe("(Body ILIKE '%myTerm%')");
    });

    it('negated implicit field - single token uses NOT hasToken when caseSensitive', async () => {
      const result = await caseSensitiveSerializer.fieldSearch(
        '<implicit>',
        'error',
        true,
        false,
        false,
      );
      expect(result).toBe("(NOT hasToken(Body, 'error'))");
    });

    it('negated implicit field - wildcard uses NOT LIKE without lower() when caseSensitive', async () => {
      const result = await caseSensitiveSerializer.fieldSearch(
        '<implicit>',
        'err',
        true,
        true,
        true,
      );
      expect(result).toBe("(Body NOT LIKE '%err%')");
    });
  });
});
