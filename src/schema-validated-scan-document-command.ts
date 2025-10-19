import { ScanCommand as _ScanCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import type { JsonFormat } from "./json-format.js";
import type { ScanCommand } from "./scan.js";

export function SchemaValidatedScanDocumentCommand<Item extends object>(
  schema: z.ZodSchema<Item>,
): ScanCommand<Item, JsonFormat.Document> & {
  _schema: z.ZodSchema<Item>;
  _brand: "ScanCommand";
} {
  class SchemaValidatedCommand extends _ScanCommand {
    _brand = "ScanCommand" as const;
  }
  (SchemaValidatedCommand as any)._schema = schema;
  return SchemaValidatedCommand as any;
}
