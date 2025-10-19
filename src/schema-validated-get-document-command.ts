import { GetCommand as _GetCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import type { GetCommand } from "./get-command.js";
import type { JsonFormat } from "./json-format.js";

export function SchemaValidatedGetDocumentCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
>(
  schema: z.ZodSchema<Item>,
): GetCommand<Item, PartitionKey, RangeKey, JsonFormat.Document> & {
  _schema: z.ZodSchema<Item>;
  _brand: "GetItemCommand";
} {
  class SchemaValidatedCommand extends _GetCommand {
    _brand = "GetItemCommand" as const;
  }
  (SchemaValidatedCommand as any)._schema = schema;
  return SchemaValidatedCommand as any;
}
