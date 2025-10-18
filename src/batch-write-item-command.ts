import { BatchWriteItemCommand as _BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import type { BatchWriteCommand } from "./batch-write-item.js";
import type { JsonFormat } from "./json-format.js";

export function TypeSafeBatchWriteItemCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined = undefined,
>(): BatchWriteCommand<
  Item,
  PartitionKey,
  RangeKey,
  JsonFormat.AttributeValue
> {
  return _BatchWriteItemCommand as any;
}
