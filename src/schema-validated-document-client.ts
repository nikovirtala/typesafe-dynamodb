import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";

export class SchemaValidatedDocumentClient {
  constructor(private client: DynamoDBDocumentClient) {}

  async send<T, Item extends object>(
    command: T,
    schema?: z.ZodSchema<Item>,
  ): Promise<
    T extends { _brand: "UpdateItemCommand" }
      ? { Attributes?: Item; $metadata: any }
      : T extends { _brand: "DeleteItemCommand" }
        ? { Attributes?: Item; $metadata: any }
        : T extends { _brand: "PutItemCommand" }
          ? { Attributes?: Item; $metadata: any }
          : T extends { _brand: "GetItemCommand" }
            ? { Item?: Item; $metadata: any }
            : T extends { _brand: "QueryCommand" | "ScanCommand" }
              ? {
                  Items?: Item[];
                  $metadata: any;
                  Count?: number;
                  ScannedCount?: number;
                  LastEvaluatedKey?: any;
                }
              : Awaited<ReturnType<DynamoDBDocumentClient["send"]>>
  > {
    const result = await this.client.send(command as any);

    if (schema) {
      if ("Item" in result && result.Item) {
        (result as any).Item = schema.parse(result.Item);
      }

      if ("Attributes" in result && result.Attributes) {
        (result as any).Attributes = schema.parse(result.Attributes);
      }

      if ("Items" in result && result.Items) {
        (result as any).Items = result.Items.map((item: any) =>
          schema.parse(item),
        );
      }
    }

    return result as any;
  }
}
