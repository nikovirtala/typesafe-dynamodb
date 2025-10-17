import { QueryCommand as _QueryCommand } from "@aws-sdk/client-dynamodb";
import { JsonFormat } from "./json-format.js";
import { QueryCommand } from "./query.js";

export function TypeSafeQueryCommand<Item extends object>(): QueryCommand<
  Item,
  JsonFormat.AttributeValue
> {
  return _QueryCommand as any;
}
