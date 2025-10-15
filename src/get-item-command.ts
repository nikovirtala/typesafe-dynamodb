import { GetCommand as _GetCommand } from "@aws-sdk/lib-dynamodb";
import type { GetCommand } from "./get-command";
import type { JsonFormat } from "./json-format";

export function TypeSafeGetItemCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
>(): GetCommand<Item, PartitionKey, RangeKey, JsonFormat.AttributeValue> {
  return _GetCommand as any;
}
