import { ScanCommand as _ScanCommand } from "@aws-sdk/client-dynamodb";
import type { JsonFormat } from "./json-format.js";
import type { ScanCommand } from "./scan.js";

export function TypeSafeScanCommand<Item extends object>(): ScanCommand<
  Item,
  JsonFormat.AttributeValue
> {
  return _ScanCommand as any;
}
