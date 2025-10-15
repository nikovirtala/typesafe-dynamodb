import "jest";
import { z } from "zod";
import { SchemaValidatedGetDocumentCommand } from "../src/schema-validated-get-document-command";

const MyTypeSchema = z.object({
  pk: z.string(),
  sk: z.number(),
  list: z.array(z.string()),
});

type MyType = z.infer<typeof MyTypeSchema>;

const GetDocumentCommand = SchemaValidatedGetDocumentCommand<
  MyType,
  "pk",
  "sk"
>(MyTypeSchema);

it("should have schema attached", () => {
  expect(GetDocumentCommand._schema).toBe(MyTypeSchema);
});

it("should work with type-safe operations", async () => {
  const getCommand = new GetDocumentCommand({
    TableName: "test-table",
    Key: {
      pk: "test-pk",
      sk: 1,
    },
    ProjectionExpression: "pk, sk",
  });

  expect(getCommand.input.Key.pk).toBe("test-pk");
  expect(getCommand.input.Key.sk).toBe(1);
});
