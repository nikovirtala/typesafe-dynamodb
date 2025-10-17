import { it, expect } from "vitest";
import { z } from "zod";
import { SchemaValidatedPutDocumentCommand } from "../src/schema-validated-put-document-command.js";

const MyTypeSchema = z.object({
  pk: z.string(),
  sk: z.number(),
  list: z.array(z.string()),
});

type MyType = z.infer<typeof MyTypeSchema>;

const PutDocumentCommand =
  SchemaValidatedPutDocumentCommand<MyType>(MyTypeSchema);

it("should have schema attached", () => {
  expect(PutDocumentCommand._schema).toBe(MyTypeSchema);
});

it("should work with type-safe operations", async () => {
  const putCommand = new PutDocumentCommand({
    TableName: "test-table",
    Item: {
      pk: "test-pk",
      sk: 1,
      list: ["item1", "item2"],
    },
    ConditionExpression: "attribute_not_exists(pk)",
  });

  expect(putCommand.input.Item.pk).toBe("test-pk");
  expect(putCommand.input.Item.sk).toBe(1);
  expect(putCommand.input.Item.list).toEqual(["item1", "item2"]);
});
