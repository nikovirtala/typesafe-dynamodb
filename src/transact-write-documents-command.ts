import { TransactWriteCommand as _TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import type { JsonFormat } from "./json-format.js";
import type { TransactWriteCommand } from "./transact-write-items.js";

export function TypeSafeTransactWriteDocumentCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined = undefined,
>(): TransactWriteCommand<Item, PartitionKey, RangeKey, JsonFormat.Document> {
  return _TransactWriteCommand as any;
}
