import type {
  DynamoDBClientResolvedConfig,
  ReturnValue as DynamoDBReturnValue,
  DeleteItemInput as DynamoDBDeleteItemInput,
  DeleteItemOutput as DynamoDBDeleteItemOutput,
} from "@aws-sdk/client-dynamodb";
import type { MetadataBearer } from "@aws-sdk/types";
import type { Command } from "@smithy/smithy-client";
import type {
  ExpressionAttributeNames,
  ExpressionAttributeValues,
} from "./expression-attributes";
import type { FormatObject, JsonFormat } from "./json-format";
import type { TableKey } from "./key";

export type DeleteItemInput<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Key extends TableKey<Item, PartitionKey, RangeKey, Format>,
  ConditionExpression extends string | undefined,
  ReturnValue extends DynamoDBReturnValue,
  Format extends JsonFormat,
> = Omit<
  DynamoDBDeleteItemInput,
  | "ConditionExpression"
  | "ExpressionAttributeNames"
  | "ExpressionAttributeValues"
  | "Item"
  | "Key"
  | "ReturnValues"
> &
  ExpressionAttributeNames<ConditionExpression> &
  ExpressionAttributeValues<ConditionExpression, Format> & {
    Key: Key;
    ReturnValues?: ReturnValue;
    ConditionExpression?: ConditionExpression;
  };

export interface DeleteItemOutput<
  Item extends object,
  ReturnValue extends DynamoDBReturnValue,
  Format extends JsonFormat,
> extends Omit<DynamoDBDeleteItemOutput, "Attributes"> {
  Attributes?: "ALL_OLD" | "ALL_NEW" extends ReturnValue
    ? FormatObject<Item, Format>
    : undefined | "NONE" extends ReturnValue
      ? undefined
      : "UPDATED_OLD" | "UPDATED_NEW" extends ReturnValue
        ? Partial<FormatObject<Item, Format>>
        : Partial<FormatObject<Item, Format>>;
}

export type DeleteCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Format extends JsonFormat,
> = new <
  Key extends TableKey<Item, PartitionKey, RangeKey, Format>,
  const ConditionExpression extends string | undefined = undefined,
  const ReturnValue extends DynamoDBReturnValue = "NONE",
>(
  input: DeleteItemInput<
    Item,
    PartitionKey,
    RangeKey,
    Key,
    ConditionExpression,
    ReturnValue,
    Format
  >,
) => Command<
  DeleteItemInput<
    Item,
    PartitionKey,
    RangeKey,
    Key,
    ConditionExpression,
    ReturnValue,
    Format
  >,
  DeleteItemOutput<Item, ReturnValue, Format> & MetadataBearer,
  DynamoDBClientResolvedConfig
> & {
  _brand: "DeleteItemCommand";
};
