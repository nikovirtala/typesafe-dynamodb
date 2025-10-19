import { DeleteCommand as _DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import type { DeleteCommand } from "./delete-item.js";
import type { JsonFormat } from "./json-format.js";

export function SchemaValidatedDeleteDocumentCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
>(
  schema: z.ZodSchema<Item>,
): DeleteCommand<Item, PartitionKey, RangeKey, JsonFormat.Document> & {
  _schema: z.ZodSchema<Item>;
  _brand: "DeleteItemCommand";
} {
  class SchemaValidatedCommand extends _DeleteCommand {
    _brand = "DeleteItemCommand" as const;
  }
  (SchemaValidatedCommand as any)._schema = schema;
  return SchemaValidatedCommand as any;
}
