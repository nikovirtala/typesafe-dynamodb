#!/usr/bin/env node --experimental-strip-types

import { performance, PerformanceObserver } from "node:perf_hooks";
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  ResourceNotFoundException,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { SchemaValidatedDocumentClient } from "../lib/schema-validated-document-client.js";
import { SchemaValidatedGetDocumentCommand } from "../lib/schema-validated-get-document-command.js";
import { SchemaValidatedPutDocumentCommand } from "../lib/schema-validated-put-document-command.js";
import { SchemaValidatedQueryDocumentCommand } from "../lib/schema-validated-query-document-command.js";
import { SchemaValidatedUpdateDocumentCommand } from "../lib/schema-validated-update-document-command.js";
import { SchemaValidatedDeleteDocumentCommand } from "../lib/schema-validated-delete-document-command.js";
import * as fs from "node:fs";
import * as path from "node:path";

interface Config {
  id: number;
  tableName: string;
  createTable: boolean;
  operations: Array<"get" | "put" | "query" | "update" | "delete">;
  executions: number;
  region: string;
  outputFile: string;
  markdownFile: string;
}

interface Result {
  operation: string;
  executions: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  measurements: number[];
}

interface Summary {
  config: Config;
  timestamp: string;
  results: Result[];
  totals: {
    totalOperations: number;
    totalTime: number;
  };
}

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

type TestItem = z.infer<typeof TestSchema>;

class PerformanceTester {
  private client: DynamoDBClient;
  private documentClient: DynamoDBDocumentClient;
  private schemaValidatedClient: SchemaValidatedDocumentClient;
  private measurements: Map<string, number[]> = new Map();

  constructor(region: string) {
    this.client = new DynamoDBClient({ region });
    this.documentClient = DynamoDBDocumentClient.from(this.client);
    this.schemaValidatedClient = new SchemaValidatedDocumentClient(
      this.documentClient,
    );
    this.setupPerformanceObserver();
  }

  private setupPerformanceObserver() {
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.startsWith("test-")) {
          const operation = entry.name.split("-")[1]; // extract operation type (get, put, etc.)
          if (!this.measurements.has(operation)) {
            this.measurements.set(operation, []);
          }
          this.measurements.get(operation)!.push(entry.duration);
        }
      }
    });
    obs.observe({ entryTypes: ["measure"] });
  }

  private async ensureTableExists(tableName: string): Promise<void> {
    try {
      await this.client.send(
        new DescribeTableCommand({ TableName: tableName }),
      );
      console.log(`Table ${tableName} already exists`);
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        console.log(`Creating table ${tableName}...`);
        await this.createTable(tableName);
        await this.waitForTableActive(tableName);
        console.log(`Table ${tableName} created successfully`);
      } else {
        throw error;
      }
    }
  }

  private async createTable(tableName: string): Promise<void> {
    await this.client.send(
      new CreateTableCommand({
        TableName: tableName,
        KeySchema: [
          { AttributeName: "pk", KeyType: "HASH" },
          { AttributeName: "sk", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "pk", AttributeType: "S" },
          { AttributeName: "sk", AttributeType: "S" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      }),
    );
  }

  private async waitForTableActive(tableName: string): Promise<void> {
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      const { Table } = await this.client.send(
        new DescribeTableCommand({ TableName: tableName }),
      );
      if (Table?.TableStatus === "ACTIVE") {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }
    throw new Error(
      `Table ${tableName} did not become active within ${maxAttempts} seconds`,
    );
  }

  private generateTestItem(index: number): TestItem {
    return {
      pk: `test-pk-${index}`,
      sk: `test-sk-${index}`,
      data: `test-data-${index}-${Date.now()}`,
      timestamp: Date.now(),
      metadata: {
        version: 1,
        tags: [`tag-${index}`, "performance-test"],
      },
    };
  }

  private async testGet(tableName: string, executions: number): Promise<void> {
    const GetCommand = SchemaValidatedGetDocumentCommand<TestItem, "pk", "sk">(
      TestSchema,
    );

    for (let i = 0; i < executions; i++) {
      const startMark = `get-start-${i}`;
      const endMark = `get-end-${i}`;
      const measureName = `test-get-${i}`;

      performance.mark(startMark);

      try {
        await this.schemaValidatedClient.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              pk: `test-pk-${i}`,
              sk: `test-sk-${i}`,
            },
          }),
          TestSchema,
        );
      } catch (e) {
        console.error(e);
      }

      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
    }
  }

  private async testPut(tableName: string, executions: number): Promise<void> {
    const PutCommand = SchemaValidatedPutDocumentCommand<TestItem>(TestSchema);

    for (let i = 0; i < executions; i++) {
      const startMark = `put-start-${i}`;
      const endMark = `put-end-${i}`;
      const measureName = `test-put-${i}`;

      performance.mark(startMark);

      try {
        await this.schemaValidatedClient.send(
          new PutCommand({
            TableName: tableName,
            Item: this.generateTestItem(i),
          }),
          TestSchema,
        );
      } catch (e) {
        console.error(e);
      }

      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
    }
  }

  private async testQuery(
    tableName: string,
    executions: number,
  ): Promise<void> {
    const QueryCommand =
      SchemaValidatedQueryDocumentCommand<TestItem>(TestSchema);

    for (let i = 0; i < executions; i++) {
      const startMark = `query-start-${i}`;
      const endMark = `query-end-${i}`;
      const measureName = `test-query-${i}`;

      performance.mark(startMark);

      try {
        await this.schemaValidatedClient.send(
          new QueryCommand({
            TableName: tableName,
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: {
              ":pk": `test-pk-${i % 10}`,
            },
          }),
          TestSchema,
        );
      } catch (e) {
        console.error(e);
      }

      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
    }
  }

  private async testUpdate(
    tableName: string,
    executions: number,
  ): Promise<void> {
    const UpdateCommand = SchemaValidatedUpdateDocumentCommand<
      TestItem,
      "pk",
      "sk"
    >(TestSchema);

    for (let i = 0; i < executions; i++) {
      const startMark = `update-start-${i}`;
      const endMark = `update-end-${i}`;
      const measureName = `test-update-${i}`;

      performance.mark(startMark);

      try {
        await this.schemaValidatedClient.send(
          new UpdateCommand({
            TableName: tableName,
            Key: {
              pk: `test-pk-${i}`,
              sk: `test-sk-${i}`,
            },
            UpdateExpression: "SET #data = :data, #timestamp = :timestamp",
            ExpressionAttributeNames: {
              "#data": "data",
              "#timestamp": "timestamp",
            },
            ExpressionAttributeValues: {
              ":data": `updated-data-${i}`,
              ":timestamp": Date.now(),
            },
          }),
          TestSchema,
        );
      } catch (e) {
        console.error(e);
      }

      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
    }
  }

  private async testDelete(
    tableName: string,
    executions: number,
  ): Promise<void> {
    const DeleteCommand = SchemaValidatedDeleteDocumentCommand<
      TestItem,
      "pk",
      "sk"
    >(TestSchema);

    for (let i = 0; i < executions; i++) {
      const startMark = `delete-start-${i}`;
      const endMark = `delete-end-${i}`;
      const measureName = `test-delete-${i}`;

      performance.mark(startMark);

      try {
        await this.schemaValidatedClient.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              pk: `test-pk-${i}`,
              sk: `test-sk-${i}`,
            },
          }),
          TestSchema,
        );
      } catch (e) {
        console.error(e);
      }

      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
    }
  }

  private calculateStats(
    measurements: number[],
  ): Omit<Result, "operation" | "executions"> {
    const totalTime = measurements.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / measurements.length;
    const minTime = Math.min(...measurements);
    const maxTime = Math.max(...measurements);

    const sorted = [...measurements].sort((a, b) => a - b);
    const p50 = this.percentile(sorted, 50);
    const p90 = this.percentile(sorted, 90);
    const p95 = this.percentile(sorted, 95);
    const p99 = this.percentile(sorted, 99);

    return {
      totalTime,
      averageTime,
      minTime,
      maxTime,
      p50,
      p90,
      p95,
      p99,
      measurements,
    };
  }

  private percentile(sorted: number[], p: number): number {
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (upper >= sorted.length) return sorted[sorted.length - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  private generateMarkdownSummary(summary: Summary): string {
    const { config, timestamp, results, totals } = summary;

    let markdown = `# Performance Test Results\n\n`;
    markdown += `**Test ID:** ${config.id}\n`;
    markdown += `**Timestamp:** ${timestamp}\n`;
    markdown += `**Table:** ${config.tableName}\n`;
    markdown += `**Region:** ${config.region}\n`;
    markdown += `**Total Operations:** ${totals.totalOperations}\n`;
    markdown += `**Total Time:** ${totals.totalTime.toFixed(2)}ms\n\n`;

    markdown += `## Results\n\n`;
    markdown += `| Operation | Executions | Total (ms) | Avg (ms) | Min (ms) | Max (ms) | P50 (ms) | P90 (ms) | P95 (ms) | P99 (ms) |\n`;
    markdown += `|-----------|------------|------------|----------|----------|----------|----------|----------|----------|----------|\n`;

    for (const result of results) {
      markdown += `| ${result.operation.toUpperCase()} | ${result.executions} | ${result.totalTime.toFixed(2)} | ${result.averageTime.toFixed(2)} | ${result.minTime.toFixed(2)} | ${result.maxTime.toFixed(2)} | ${result.p50.toFixed(2)} | ${result.p90.toFixed(2)} | ${result.p95.toFixed(2)} | ${result.p99.toFixed(2)} |\n`;
    }

    return markdown;
  }

  async runTests(config: Config): Promise<Summary> {
    console.log(`Starting performance tests with config:`, config);

    if (config.createTable) {
      await this.ensureTableExists(config.tableName);
    }

    const startTime = performance.now();
    this.measurements.clear();

    // run tests for each operation (put first to ensure data exists)
    const orderedOps = [...config.operations].sort((a, b) => {
      const order = { put: 0, get: 1, query: 2, update: 3, delete: 4 };
      return order[a] - order[b];
    });

    for (const operation of orderedOps) {
      console.log(
        `Running ${operation} tests (${config.executions} executions)...`,
      );

      switch (operation) {
        case "get":
          await this.testGet(config.tableName, config.executions);
          break;
        case "put":
          await this.testPut(config.tableName, config.executions);
          break;
        case "query":
          await this.testQuery(config.tableName, config.executions);
          break;
        case "update":
          await this.testUpdate(config.tableName, config.executions);
          break;
        case "delete":
          await this.testDelete(config.tableName, config.executions);
          break;
      }
    }

    const endTime = performance.now();
    const totalTestTime = endTime - startTime;

    // process results
    const results: Result[] = [];
    let totalOperations = 0;

    for (const [operation, measurements] of this.measurements.entries()) {
      const stats = this.calculateStats(measurements);

      results.push({
        operation,
        executions: measurements.length,
        ...stats,
      });

      totalOperations += measurements.length;
    }

    const testResults: Summary = {
      config,
      timestamp: new Date().toISOString(),
      results,
      totals: {
        totalOperations,
        totalTime: totalTestTime,
      },
    };

    // save results
    const outputPath = path.resolve(config.outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(testResults, null, 2));
    console.log(`Results saved to: ${outputPath}`);

    // save markdown summary
    const markdownPath = path.resolve(config.markdownFile);
    const markdown = this.generateMarkdownSummary(testResults);
    fs.writeFileSync(markdownPath, markdown);
    console.log(`Markdown summary saved to: ${markdownPath}`);

    return testResults;
  }

  destroy() {
    this.client.destroy();
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Usage: node --experimental-strip-types performance-test.ts [options]

Options:
  --table <name>        DynamoDB Table name (default: auto-generated)
  --operations <ops>    Comma-separated operations: get,put,query,update,delete (default: all)
  --executions <num>    Number of executions per operation (default: 1000)
  --region <region>     AWS region (default: eu-west-1)
  --output <file>       Output JSON file path (default: auto-generated)
  --help, -h            Show this help message

Examples:
  node --experimental-strip-types performance-test.ts
  node --experimental-strip-types performance-test.ts --table my-table --operations get,put --executions 500
    `);
    return;
  }

  function getArg(name: string): string | undefined {
    const index = args.indexOf(name);
    return index !== -1 && index + 1 < args.length
      ? args[index + 1]
      : undefined;
  }

  const id = Date.now();
  const userProvidedTable = getArg("--table");
  const config: Config = {
    id,
    tableName: userProvidedTable ?? `performance-test-${id}`,
    operations: (getArg("--operations") ?? "get,put,query,update,delete").split(
      ",",
    ) as Config["operations"],
    executions: parseInt(getArg("--executions") ?? "1000"),
    region: getArg("--region") ?? "eu-west-1",
    outputFile: getArg("--output") ?? `performance-test-results-${id}.json`,
    markdownFile: `performance-test-results-${id}.md`,
    createTable: !userProvidedTable,
  };

  const tester = new PerformanceTester(config.region);

  try {
    const results = await tester.runTests(config);

    console.log("\n=== Performance Test Results ===");
    console.log(`Total operations: ${results.totals.totalOperations}`);
    console.log(`Total time: ${results.totals.totalTime.toFixed(2)}ms`);

    console.log("\n=== Operation Details ===");
    for (const result of results.results) {
      console.log(`${result.operation.toUpperCase()}:`);
      console.log(`  Executions: ${result.executions}`);
      console.log(`  Total time: ${result.totalTime.toFixed(2)}ms`);
      console.log(`  Average time: ${result.averageTime.toFixed(2)}ms`);
      console.log(`  Min time: ${result.minTime.toFixed(2)}ms`);
      console.log(`  Max time: ${result.maxTime.toFixed(2)}ms`);
      console.log(`  P50: ${result.p50.toFixed(2)}ms`);
      console.log(`  P90: ${result.p90.toFixed(2)}ms`);
      console.log(`  P95: ${result.p95.toFixed(2)}ms`);
      console.log(`  P99: ${result.p99.toFixed(2)}ms`);
    }
  } finally {
    tester.destroy();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
