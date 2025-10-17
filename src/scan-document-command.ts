import { ScanCommand as _ScanCommand } from "@aws-sdk/client-dynamodb";
import type { JsonFormat } from "./json-format.js";
import type { ScanCommand } from "./scan.js";

export function TypeSafeScanDocumentCommand<Item extends object>(): ScanCommand<
  Item,
  JsonFormat.Document
> {
  return _ScanCommand as any;
}
