import { it, expect } from "vitest";
import { z } from "zod";
import { SchemaValidatedScanDocumentCommand } from "../src/schema-validated-scan-document-command.js";

const MyTypeSchema = z.object({
  pk: z.string(),
  sk: z.number(),
  list: z.array(z.string()),
});

type MyType = z.infer<typeof MyTypeSchema>;

const ScanDocumentCommand =
  SchemaValidatedScanDocumentCommand<MyType>(MyTypeSchema);

it("should have schema attached", () => {
  expect(ScanDocumentCommand._schema).toBe(MyTypeSchema);
});

it("should work with type-safe operations", async () => {
  const scanCommand = new ScanDocumentCommand({
    TableName: "test-table",
    FilterExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": "test-pk",
    },
    ProjectionExpression: "pk, sk",
  });

  expect(scanCommand.input.TableName).toBe("test-table");
  expect(scanCommand.input.FilterExpression).toBe("pk = :pk");
  expect(scanCommand.input.ExpressionAttributeValues?.[":pk"]).toBe("test-pk");
});
