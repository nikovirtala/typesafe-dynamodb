import { UpdateItemCommand as _UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { JsonFormat } from "./json-format.js";
import { UpdateCommand } from "./update-item.js";

export function TypeSafeUpdateItemCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
>(): UpdateCommand<Item, PartitionKey, RangeKey, JsonFormat.AttributeValue> {
  return _UpdateItemCommand as any;
}
