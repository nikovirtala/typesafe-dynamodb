import { it, expect } from "vitest";
import { z } from "zod";
import { SchemaValidatedDeleteDocumentCommand } from "../src/schema-validated-delete-document-command.js";

const MyTypeSchema = z.object({
  pk: z.string(),
  sk: z.number(),
  list: z.array(z.string()),
});

type MyType = z.infer<typeof MyTypeSchema>;

const DeleteDocumentCommand = SchemaValidatedDeleteDocumentCommand<
  MyType,
  "pk",
  "sk"
>(MyTypeSchema);

it("should have schema attached", () => {
  expect(DeleteDocumentCommand._schema).toBe(MyTypeSchema);
});

it("should work with type-safe operations", async () => {
  const deleteCommand = new DeleteDocumentCommand({
    TableName: "test-table",
    Key: {
      pk: "test-pk",
      sk: 1,
    },
    ConditionExpression: "attribute_exists(pk)",
  });

  expect(deleteCommand.input.Key.pk).toBe("test-pk");
  expect(deleteCommand.input.Key.sk).toBe(1);
});
