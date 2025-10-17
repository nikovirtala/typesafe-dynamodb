import { it, expect } from "vitest";
import { z } from "zod";
import { SchemaValidatedUpdateDocumentCommand } from "../src/schema-validated-update-document-command.js";

const MyTypeSchema = z.object({
  pk: z.string(),
  sk: z.number(),
  list: z.array(z.string()),
});

type MyType = z.infer<typeof MyTypeSchema>;

const UpdateDocumentCommand = SchemaValidatedUpdateDocumentCommand<
  MyType,
  "pk",
  "sk"
>(MyTypeSchema);

it("should have schema attached", () => {
  expect(UpdateDocumentCommand._schema).toBe(MyTypeSchema);
});

it("should work with type-safe operations", async () => {
  const updateCommand = new UpdateDocumentCommand({
    TableName: "test-table",
    Key: {
      pk: "test-pk",
      sk: 1,
    },
    UpdateExpression: "SET #list = :list",
    ExpressionAttributeNames: {
      "#list": "list",
    },
    ExpressionAttributeValues: {
      ":list": ["item1", "item2"],
    },
  });

  expect(updateCommand.input.Key.pk).toBe("test-pk");
  expect(updateCommand.input.Key.sk).toBe(1);
});
