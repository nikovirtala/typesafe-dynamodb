import {
  DynamoDBClientResolvedConfig,
  GetItemCommand as _GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { MetadataBearer } from "@aws-sdk/types";
import type { Command } from "@smithy/smithy-client";
import { GetItemInput, GetItemOutput } from "./get-item.js";
import { JsonFormat } from "./json-format.js";
import { TableKey } from "./key.js";
import { Simplify } from "./simplify.js";

export type GetCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Format extends JsonFormat,
> = new <
  Key extends TableKey<Item, PartitionKey, RangeKey, Format>,
  const AttributesToGet extends keyof Item | undefined,
  const ProjectionExpression extends string | undefined,
>(
  input: GetItemInput<
    Item,
    PartitionKey,
    RangeKey,
    Key,
    AttributesToGet,
    ProjectionExpression,
    Format
  >,
) => Command<
  GetItemInput<
    Item,
    PartitionKey,
    RangeKey,
    Key,
    AttributesToGet,
    ProjectionExpression,
    Format
  >,
  Simplify<
    GetItemOutput<
      Item,
      PartitionKey,
      RangeKey,
      Key,
      AttributesToGet,
      ProjectionExpression,
      Format
    > &
      MetadataBearer
  >,
  DynamoDBClientResolvedConfig
> & {
  _brand: "GetItemCommand";
};
