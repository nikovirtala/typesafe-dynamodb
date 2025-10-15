import type {
  DynamoDBClientResolvedConfig,
  ScanCommand as _ScanCommand,
  ScanInput as DynamoDBScanInput,
  ScanOutput as DynamoDBScanOutput,
} from "@aws-sdk/client-dynamodb";
import type { MetadataBearer } from "@aws-sdk/types";
import type { Command } from "@smithy/smithy-client";
import type {
  ExpressionAttributeNames,
  ExpressionAttributeValues,
} from "./expression-attributes";
import type { FormatObject, JsonFormat } from "./json-format";

export type ScanInput<
  Item extends object,
  FilterExpression extends string | undefined,
  ProjectionExpression extends string | undefined,
  AttributesToGet extends keyof Item | undefined,
  Format extends JsonFormat,
> = Omit<
  DynamoDBScanInput,
  | "AttributesToGet"
  | "FilterExpression"
  | "ExpressionAttributeNames"
  | "ExpressionAttributeValues"
> &
  ExpressionAttributeNames<FilterExpression> &
  ExpressionAttributeValues<FilterExpression, Format> & {
    FilterExpression?: FilterExpression;
    ProjectionExpression?: ProjectionExpression;
    AttributesToGet?: AttributesToGet[];
  };

export interface ScanOutput<
  Item extends object,
  AttributesToGet extends keyof Item | undefined,
  Format extends JsonFormat,
> extends Omit<DynamoDBScanOutput, "Items"> {
  Items?: FormatObject<
    undefined extends AttributesToGet
      ? Item
      : Pick<Item, Extract<AttributesToGet, keyof Item>>,
    Format
  >[];
}

export type ScanCommand<Item extends object, Format extends JsonFormat> = new <
  const FilterExpression extends string | undefined,
  const ProjectionExpression extends string | undefined,
  const AttributesToGet extends keyof Item | undefined,
>(
  input: ScanInput<
    Item,
    FilterExpression,
    ProjectionExpression,
    AttributesToGet,
    Format
  >,
) => Command<
  ScanInput<
    Item,
    FilterExpression,
    ProjectionExpression,
    AttributesToGet,
    Format
  >,
  ScanOutput<Item, AttributesToGet, Format> & MetadataBearer,
  DynamoDBClientResolvedConfig
> & {
  _brand: "ScanCommand";
};
