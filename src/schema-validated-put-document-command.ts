import { PutCommand as _PutCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import type { JsonFormat } from "./json-format.js";
import type { PutCommand } from "./put-item.js";

export function SchemaValidatedPutDocumentCommand<Item extends object>(
  schema: z.ZodSchema<Item>,
): PutCommand<Item, JsonFormat.Document> & {
  _schema: z.ZodSchema<Item>;
  _brand: "PutItemCommand";
} {
  class SchemaValidatedCommand extends _PutCommand {
    _brand = "PutItemCommand" as const;
  }
  (SchemaValidatedCommand as any)._schema = schema;
  return SchemaValidatedCommand as any;
}
