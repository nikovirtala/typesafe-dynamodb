import type {
  DynamoDBClientResolvedConfig,
  QueryInput as DynamoDBQueryInput,
  QueryOutput as DynamoDBQueryOutput,
} from "@aws-sdk/client-dynamodb";
import type { MetadataBearer } from "@aws-sdk/types";
import type { Command } from "@smithy/smithy-client";
import type {
  ExpressionAttributeNames,
  ExpressionAttributeValues,
} from "./expression-attributes.js";
import type { FormatObject, JsonFormat } from "./json-format.js";

export type QueryInput<
  Item extends object,
  KeyConditionExpression extends string | undefined,
  FilterExpression extends string | undefined,
  ProjectionExpression extends string | undefined,
  AttributesToGet extends keyof Item | undefined,
  Format extends JsonFormat,
> = Omit<
  DynamoDBQueryInput,
  | "AttributesToGet"
  | "KeyConditionExpression"
  | "FilterExpression"
  | "ExpressionAttributeNames"
  | "ExpressionAttributeValues"
> &
  ExpressionAttributeNames<KeyConditionExpression> &
  ExpressionAttributeNames<FilterExpression> &
  ExpressionAttributeNames<ProjectionExpression> &
  ExpressionAttributeValues<KeyConditionExpression, Format> &
  ExpressionAttributeValues<FilterExpression, Format> & {
    KeyConditionExpression?: KeyConditionExpression;
    FilterExpression?: FilterExpression;
    ProjectionExpression?: ProjectionExpression;
    AttributesToGet?: AttributesToGet[];
  };

export interface QueryOutput<
  Item extends object,
  AttributesToGet extends keyof Item | undefined,
  Format extends JsonFormat,
> extends Omit<DynamoDBQueryOutput, "Items"> {
  Items?: FormatObject<
    undefined extends AttributesToGet
      ? Item
      : Pick<Item, Extract<AttributesToGet, keyof Item>>,
    Format
  >[];
}

export type QueryCommand<Item extends object, Format extends JsonFormat> = new <
  const KeyConditionExpression extends string | undefined,
  const FilterExpression extends string | undefined,
  const ProjectionExpression extends string | undefined,
  const AttributesToGet extends keyof Item | undefined,
>(
  input: QueryInput<
    Item,
    KeyConditionExpression,
    FilterExpression,
    ProjectionExpression,
    AttributesToGet,
    Format
  >,
) => Command<
  QueryInput<
    Item,
    KeyConditionExpression,
    FilterExpression,
    ProjectionExpression,
    AttributesToGet,
    Format
  >,
  QueryOutput<Item, AttributesToGet, Format> & MetadataBearer,
  DynamoDBClientResolvedConfig
> & {
  _brand: "QueryCommand";
};
