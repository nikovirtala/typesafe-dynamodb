import { BatchWriteItemCommand as _BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import type { BatchWriteCommand } from "./batch-write-item.js";
import type { JsonFormat } from "./json-format.js";

export function TypeSafeBatchWriteItemCommand<
  Item extends object,
>(): BatchWriteCommand<Item, JsonFormat.AttributeValue> {
  return _BatchWriteItemCommand as any;
}
