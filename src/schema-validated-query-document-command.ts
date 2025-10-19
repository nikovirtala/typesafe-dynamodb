import { QueryCommand as _QueryCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import type { JsonFormat } from "./json-format.js";
import type { QueryCommand } from "./query.js";

export function SchemaValidatedQueryDocumentCommand<Item extends object>(
  schema: z.ZodSchema<Item>,
): QueryCommand<Item, JsonFormat.Document> & {
  _schema: z.ZodSchema<Item>;
  _brand: "QueryCommand";
} {
  class SchemaValidatedCommand extends _QueryCommand {
    _brand = "QueryCommand" as const;
  }
  (SchemaValidatedCommand as any)._schema = schema;
  return SchemaValidatedCommand as any;
}
