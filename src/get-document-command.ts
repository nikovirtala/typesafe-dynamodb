import { GetCommand as _GetCommand } from "@aws-sdk/lib-dynamodb";
import type { GetCommand } from "./get-command";
import type { JsonFormat } from "./json-format";

export function TypeSafeGetDocumentCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
>(): GetCommand<Item, PartitionKey, RangeKey, JsonFormat.Document> {
  return _GetCommand as any;
}
