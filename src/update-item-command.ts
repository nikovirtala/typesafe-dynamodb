import { UpdateItemCommand as _UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { JsonFormat } from "./json-format";
import { UpdateCommand } from "./update-item";

export function TypeSafeUpdateItemCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
>(): UpdateCommand<Item, PartitionKey, RangeKey, JsonFormat.AttributeValue> {
  return _UpdateItemCommand as any;
}
