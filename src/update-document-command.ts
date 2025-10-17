import { UpdateCommand as _UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type { JsonFormat } from "./json-format.js";
import type { UpdateCommand } from "./update-item.js";

export function TypeSafeUpdateDocumentCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
>(): UpdateCommand<Item, PartitionKey, RangeKey, JsonFormat.Document> {
  return _UpdateCommand as any;
}
