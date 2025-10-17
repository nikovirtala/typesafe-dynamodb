import type {
  DynamoDBClientResolvedConfig,
  ReturnValue as DynamoDBReturnValue,
  PutItemInput as DynamoDBPutItemInput,
  PutItemOutput as DynamoDBPutItemOutput,
} from "@aws-sdk/client-dynamodb";
import type { MetadataBearer } from "@aws-sdk/types";
import type { Command } from "@smithy/smithy-client";
import type {
  ExpressionAttributeNames,
  ExpressionAttributeValues,
} from "./expression-attributes.js";
import type { FormatObject, JsonFormat } from "./json-format.js";

export type PutItemInput<
  Item extends object,
  ConditionExpression extends string | undefined,
  ReturnValue extends DynamoDBReturnValue,
  Format extends JsonFormat,
> = Omit<
  DynamoDBPutItemInput,
  | "ConditionExpression"
  | "ExpressionAttributeNames"
  | "ExpressionAttributeValues"
  | "Item"
  | "ReturnValues"
> &
  ExpressionAttributeNames<ConditionExpression> &
  ExpressionAttributeValues<ConditionExpression, Format> & {
    Item: FormatObject<Item, Format>;
    ReturnValues?: ReturnValue;
    ConditionExpression?: ConditionExpression;
  };

export interface PutItemOutput<
  Item extends object,
  ReturnValue extends DynamoDBReturnValue,
  Format extends JsonFormat,
> extends Omit<DynamoDBPutItemOutput, "Attributes"> {
  Attributes?: "ALL_OLD" | "ALL_NEW" extends ReturnValue
    ? FormatObject<Item, Format>
    : undefined | "NONE" extends ReturnValue
      ? undefined
      : "UPDATED_OLD" | "UPDATED_NEW" extends ReturnValue
        ? Partial<FormatObject<Item, Format>>
        : Partial<FormatObject<Item, Format>>;
}

export type PutCommand<Item extends object, Format extends JsonFormat> = new <
  const ConditionExpression extends string | undefined = undefined,
  const ReturnValue extends DynamoDBReturnValue = "NONE",
>(
  input: PutItemInput<Item, ConditionExpression, ReturnValue, Format>,
) => Command<
  PutItemInput<Item, ConditionExpression, ReturnValue, Format>,
  PutItemOutput<Item, ReturnValue, Format> & MetadataBearer,
  DynamoDBClientResolvedConfig
> & {
  _brand: "PutItemCommand";
};
