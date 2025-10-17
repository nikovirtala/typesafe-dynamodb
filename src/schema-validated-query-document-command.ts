import { QueryCommand as _QueryCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import type { JsonFormat } from "./json-format.js";
import type { QueryCommand } from "./query.js";

export function SchemaValidatedQueryDocumentCommand<Item extends object>(
  schema: z.ZodSchema<Item>,
): QueryCommand<Item, JsonFormat.Document> & {
  _schema: z.ZodSchema<Item>;
} {
  const Command = _QueryCommand as any;
  Command._schema = schema;
  return Command;
}
