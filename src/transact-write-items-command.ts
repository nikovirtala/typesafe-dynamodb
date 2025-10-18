import { TransactWriteItemsCommand as _TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import type { JsonFormat } from "./json-format.js";
import type { TransactWriteCommand } from "./transact-write-items.js";

export function TypeSafeTransactWriteItemsCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined = undefined,
>(): TransactWriteCommand<
  Item,
  PartitionKey,
  RangeKey,
  JsonFormat.AttributeValue
> {
  return _TransactWriteItemsCommand as any;
}
