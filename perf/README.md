# Performance testing

This directory contains performance testing tools for the schema-validated DynamoDB Document Client implementation.

## CLI usage

```shell
# Test with auto-generated table
node --experimental-strip-types performance-test.ts

# Test with existing table
node --experimental-strip-types performance-test.ts --table my-table

# Test with specific operations, executions, etc.
node --experimental-strip-types performance-test.ts \
  --table my-table \
  --operations get,put,query \
  --executions 1000 \
  --region us-west-2 \
  --output my-results.json
```

## Configuration options

| Option       | Description                        | Default                                   |
| ------------ | ---------------------------------- | ----------------------------------------- |
| `tableName`  | DynamoDB Table name                | auto-generated if not set                 |
| `executions` | Number of executions per operation | `100`                                     |
| `region`     | AWS region                         | `"eu-west-1"`                             |
| `outputFile` | JSON results file path             | auto-generated if not set                 |
| `operations` | Available operations               | `put`, `get`, `query`, `update`, `delete` |

## Test schema

The performance tests use a predefined Zod schema:

```typescript
const TestSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  data: z.string(),
  timestamp: z.number(),
  metadata: z.object({
    version: z.number(),
    tags: z.array(z.string()),
  }),
});
```

## Output format

Results are saved in JSON format with the following structure:

```json
{
  "config": {
    "tableName": "my-table",
    "operations": ["get", "put"],
    "executions": 100,
    "region": "eu-west-1",
    "outputFile": "results.json"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "results": [
    {
      "operation": "get",
      "executions": 100,
      "totalTime": 1234.56,
      "averageTime": 12.35,
      "minTime": 8.42,
      "maxTime": 45.67,
      "p50": 11.90,
      "p90": 18.45,
      "p95": 22.10,
      "p99": 35.20,
      "measurements": [12.3, 11.8, 13.2, ...]
    }
  ],
  "summary": {
    "totalOperations": 200,
    "totalTime": 2468.12,
    "averageTimePerOperation": 12.34
  }
}
```

## Prerequisites

1. **AWS Credentials**: Ensure AWS credentials are configured (via AWS CLI, environment variables, or IAM roles)

2. **DynamoDB Table**:
   - If no table name is specified, a table will be created automatically with a generated name
   - If a table name is specified, it should exist with:
     - Partition Key: `pk` (string)
     - Sort Key: `sk` (string)

3. **Dependencies**: All required dependencies should be installed:
   ```shell
   yarn install
   ```

## Error handling

The performance test script continues execution even if individual DynamoDB operations fail, focusing on measuring the performance of successful operations and schema validation overhead.

## Notes

- Tests run against actual DynamoDB Tables, so AWS charges may apply
- If no table name is provided, a table will be automatically created with pay-per-request billing
- If no output file is specified, results will be saved with the same timestamp as the table name
- The script ignores DynamoDB errors to focus on performance measurement
- Each operation uses realistic data patterns for accurate performance assessment
- Performance measurements include schema validation overhead
- Results include individual measurement arrays for statistical analysis
