import "jest";
import { z } from "zod";
import { SchemaValidatedQueryDocumentCommand } from "../src/schema-validated-query-document-command";

const MyTypeSchema = z.object({
  pk: z.string(),
  sk: z.number(),
  list: z.array(z.string()),
});

type MyType = z.infer<typeof MyTypeSchema>;

const QueryDocumentCommand =
  SchemaValidatedQueryDocumentCommand<MyType>(MyTypeSchema);

it("should have schema attached", () => {
  expect(QueryDocumentCommand._schema).toBe(MyTypeSchema);
});

it("should work with type-safe operations", async () => {
  const queryCommand = new QueryDocumentCommand({
    TableName: "test-table",
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": "test-pk",
    },
    ProjectionExpression: "pk, sk",
  });

  expect(queryCommand.input.KeyConditionExpression).toBe("pk = :pk");
  expect(queryCommand.input.ExpressionAttributeValues?.[":pk"]).toBe("test-pk");
});
