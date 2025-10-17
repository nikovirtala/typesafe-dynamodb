import { QueryCommand as _QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { JsonFormat } from "./json-format.js";
import type { QueryCommand } from "./query.js";

export function TypeSafeQueryDocumentCommand<
  Item extends object,
>(): QueryCommand<Item, JsonFormat.Document> {
  return _QueryCommand as any;
}
