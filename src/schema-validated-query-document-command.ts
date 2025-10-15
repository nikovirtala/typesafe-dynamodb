import { QueryCommand as _QueryCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import type { JsonFormat } from "./json-format";
import type { QueryCommand } from "./query";

export function SchemaValidatedQueryDocumentCommand<Item extends object>(
  schema: z.ZodSchema<Item>,
): QueryCommand<Item, JsonFormat.Document> & {
  _schema: z.ZodSchema<Item>;
} {
  const Command = _QueryCommand as any;
  Command._schema = schema;
  return Command;
}
