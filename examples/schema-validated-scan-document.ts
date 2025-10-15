import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { SchemaValidatedDocumentClient } from "../src/schema-validated-document-client";
import { SchemaValidatedScanDocumentCommand } from "../src/schema-validated-scan-document-command";

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

const ScanUsersCommand = SchemaValidatedScanDocumentCommand<User>(UserSchema);

async function scanUsersDocumentExample() {
  try {
    const result = await schemaValidatedDocumentClient.send(
      new ScanUsersCommand({
        TableName: "Users",
        FilterExpression: "age > :minAge",
        ExpressionAttributeValues: {
          ":minAge": 18,
        },
      }),
      UserSchema,
    );

    if (result.Items) {
      console.log("Validated users:", result.Items);
      return result.Items;
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

export { scanUsersDocumentExample, UserSchema };
