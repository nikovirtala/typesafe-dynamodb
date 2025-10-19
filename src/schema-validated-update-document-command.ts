import { UpdateCommand as _UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import type { JsonFormat } from "./json-format.js";
import type { UpdateCommand } from "./update-item.js";

export function SchemaValidatedUpdateDocumentCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
>(
  schema: z.ZodSchema<Item>,
): UpdateCommand<Item, PartitionKey, RangeKey, JsonFormat.Document> & {
  _schema: z.ZodSchema<Item>;
  _brand: "UpdateItemCommand";
} {
  class SchemaValidatedCommand extends _UpdateCommand {
    _brand = "UpdateItemCommand" as const;
  }
  (SchemaValidatedCommand as any)._schema = schema;
  return SchemaValidatedCommand as any;
}
