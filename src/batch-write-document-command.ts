import { BatchWriteCommand as _BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import type { BatchWriteCommand } from "./batch-write-item.js";
import type { JsonFormat } from "./json-format.js";

export function TypeSafeBatchWriteDocumentCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined = undefined,
>(): BatchWriteCommand<Item, PartitionKey, RangeKey, JsonFormat.Document> {
  return _BatchWriteCommand as any;
}
