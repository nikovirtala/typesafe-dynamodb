import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { SchemaValidatedDocumentClient } from "../src/schema-validated-document-client";
import { SchemaValidatedPutDocumentCommand } from "../src/schema-validated-put-document-command";

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

const PutUserCommand = SchemaValidatedPutDocumentCommand<User>(UserSchema);

async function putUserDocumentExample() {
  try {
    const result = await schemaValidatedDocumentClient.send(
      new PutUserCommand({
        TableName: "Users",
        Item: {
          pk: "USER#00000000-0000-0000-0000-000000000000",
          sk: "METADATA",
          userId: "user123",
          email: "user@example.com",
          name: "John Doe",
          age: 30,
          preferences: {
            theme: "dark",
            notifications: true,
          },
        },
        ConditionExpression: "attribute_not_exists(pk)",
      }),
      UserSchema,
    );

    console.log("User created successfully:", result);
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Schema validation failed:", error.issues);
    } else {
      console.error("DynamoDB error:", error);
    }
    throw error;
  }
}

export { putUserDocumentExample, UserSchema };
