import type {
  DynamoDBClientResolvedConfig,
  TransactWriteItemsInput as DynamoDBTransactWriteItemsInput,
  TransactWriteItemsOutput as DynamoDBTransactWriteItemsOutput,
} from "@aws-sdk/client-dynamodb";
import type { MetadataBearer } from "@aws-sdk/types";
import type { Command } from "@smithy/smithy-client";
import type { FormatObject, JsonFormat } from "./json-format.js";
import type { TableKey } from "./key.js";

export type TransactWriteItem<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Format extends JsonFormat,
> = {
  ConditionCheck?: {
    TableName: string;
    Key: TableKey<Item, PartitionKey, RangeKey, Format>;
    ConditionExpression: string;
    ExpressionAttributeNames?: Record<string, string>;
    ExpressionAttributeValues?: Record<string, any>;
    ReturnValuesOnConditionCheckFailure?: "ALL_OLD" | "NONE";
  };
  Delete?: {
    TableName: string;
    Key: TableKey<Item, PartitionKey, RangeKey, Format>;
    ConditionExpression?: string;
    ExpressionAttributeNames?: Record<string, string>;
    ExpressionAttributeValues?: Record<string, any>;
    ReturnValuesOnConditionCheckFailure?: "ALL_OLD" | "NONE";
  };
  Put?: {
    TableName: string;
    Item: FormatObject<Item, Format>;
    ConditionExpression?: string;
    ExpressionAttributeNames?: Record<string, string>;
    ExpressionAttributeValues?: Record<string, any>;
    ReturnValuesOnConditionCheckFailure?: "ALL_OLD" | "NONE";
  };
  Update?: {
    TableName: string;
    Key: TableKey<Item, PartitionKey, RangeKey, Format>;
    UpdateExpression: string;
    ConditionExpression?: string;
    ExpressionAttributeNames?: Record<string, string>;
    ExpressionAttributeValues?: Record<string, any>;
    ReturnValuesOnConditionCheckFailure?: "ALL_OLD" | "NONE";
  };
};

export type TransactWriteItemsInput<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Format extends JsonFormat,
> = Omit<DynamoDBTransactWriteItemsInput, "TransactItems"> & {
  TransactItems: TransactWriteItem<Item, PartitionKey, RangeKey, Format>[];
};

export interface TransactWriteItemsOutput<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Format extends JsonFormat,
> extends Omit<DynamoDBTransactWriteItemsOutput, "ItemCollectionMetrics"> {
  ItemCollectionMetrics?: {
    [TableName: string]: Array<{
      ItemCollectionKey?: TableKey<Item, PartitionKey, RangeKey, Format>;
      SizeEstimateRangeGB?: number[];
    }>;
  };
}

export type TransactWriteCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Format extends JsonFormat,
> = new (
  input: TransactWriteItemsInput<Item, PartitionKey, RangeKey, Format>,
) => Command<
  TransactWriteItemsInput<Item, PartitionKey, RangeKey, Format>,
  TransactWriteItemsOutput<Item, PartitionKey, RangeKey, Format> &
    MetadataBearer,
  DynamoDBClientResolvedConfig
> & {
  _brand: "TransactWriteItemsCommand";
};
