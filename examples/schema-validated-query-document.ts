import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { SchemaValidatedDocumentClient } from "../src/schema-validated-document-client";
import { SchemaValidatedQueryDocumentCommand } from "../src/schema-validated-query-document-command";

const OrderSchema = z.object({
  pk: z.templateLiteral(["USER", "#", z.uuid()]),
  sk: z.templateLiteral(["ORDER", "#", z.string()]),
  userId: z.string(),
  orderId: z.string(),
  status: z.enum(["PLACED", "SHIPPED", "DELIVERED"]),
  amount: z.number().min(0),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    }),
  ),
  createdAt: z.string().datetime(),
});

type Order = z.infer<typeof OrderSchema>;

const client = new DynamoDBClient({ region: "eu-west-1" });
const documentClient = DynamoDBDocumentClient.from(client);
const schemaValidatedDocumentClient = new SchemaValidatedDocumentClient(
  documentClient,
);

const QueryOrdersCommand =
  SchemaValidatedQueryDocumentCommand<Order>(OrderSchema);

async function queryUserOrdersExample() {
  try {
    const result = await schemaValidatedDocumentClient.send(
      new QueryOrdersCommand({
        TableName: "Orders",
        KeyConditionExpression:
          "pk = :userId AND begins_with(sk, :orderPrefix)",
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":userId": "USER#00000000-0000-0000-0000-000000000000",
          ":orderPrefix": "ORDER#",
          ":status": "SHIPPED",
        },
      }),
      OrderSchema,
    );

    if (result.Items) {
      console.log("Validated orders:", result.Items);
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

export { queryUserOrdersExample, OrderSchema };
