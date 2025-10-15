import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { SchemaValidatedDocumentClient } from "../src/schema-validated-document-client";
import { SchemaValidatedUpdateDocumentCommand } from "../src/schema-validated-update-document-command";

const UserSchema = z.object({
  pk: z.templateLiteral(["USER", "#", z.uuid()]),
  sk: z.literal("METADATA"),
  userId: z.string(),
  email: z.string().email(),
  name: z.string(),
  age: z.number().min(0),
  preferences: z.object({
    theme: z.enum(["light", "dark"]),
    notifications: z.boolean(),
  }),
});

type User = z.infer<typeof UserSchema>;

const client = new DynamoDBClient({ region: "eu-west-1" });
const documentClient = DynamoDBDocumentClient.from(client);
const schemaValidatedDocumentClient = new SchemaValidatedDocumentClient(
  documentClient,
);

const UpdateUserCommand = SchemaValidatedUpdateDocumentCommand<
  User,
  "pk",
  "sk"
>(UserSchema);

async function updateUserDocumentExample() {
  try {
    const result = await schemaValidatedDocumentClient.send(
      new UpdateUserCommand({
        TableName: "Users",
        Key: {
          pk: "USER#00000000-0000-0000-0000-000000000000",
          sk: "METADATA",
        },
        UpdateExpression:
          "SET #name = :name, #age = :age, #preferences.#theme = :theme",
        ExpressionAttributeNames: {
          "#name": "name",
          "#age": "age",
          "#preferences": "preferences",
          "#theme": "theme",
        },
        ExpressionAttributeValues: {
          ":name": "John Doe",
          ":age": 30,
          ":theme": "dark",
        },
        ReturnValues: "ALL_NEW",
      }),
      UserSchema,
    );

    if (result.Attributes) {
      console.log("Updated user:", result.Attributes);
      return result.Attributes;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Schema validation failed:", error.issues);
    } else {
      console.error("DynamoDB error:", error);
    }
    throw error;
  }
}

export { updateUserDocumentExample, UserSchema };
