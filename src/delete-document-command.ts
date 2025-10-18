import { DeleteCommand as _DeleteCommand } from "@aws-sdk/lib-dynamodb";
import type { DeleteCommand } from "./delete-item.js";
import type { JsonFormat } from "./json-format.js";

export function TypeSafeDeleteDocumentCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
>(): DeleteCommand<Item, PartitionKey, RangeKey, JsonFormat.Document> {
  return _DeleteCommand as any;
}
