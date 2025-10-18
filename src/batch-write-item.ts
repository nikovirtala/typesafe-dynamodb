import type {
  DynamoDBClientResolvedConfig,
  BatchWriteItemInput as DynamoDBBatchWriteItemInput,
  BatchWriteItemOutput as DynamoDBBatchWriteItemOutput,
} from "@aws-sdk/client-dynamodb";
import type { MetadataBearer } from "@aws-sdk/types";
import type { Command } from "@smithy/smithy-client";
import type { FormatObject, JsonFormat } from "./json-format.js";
import type { TableKey } from "./key.js";

export type BatchWriteItemInput<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Format extends JsonFormat,
> = Omit<DynamoDBBatchWriteItemInput, "RequestItems"> & {
  RequestItems: {
    [TableName: string]: Array<{
      PutRequest?: {
        Item: FormatObject<Item, Format>;
      };
      DeleteRequest?: {
        Key: TableKey<Item, PartitionKey, RangeKey, Format>;
      };
    }>;
  };
};

export interface BatchWriteItemOutput<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Format extends JsonFormat,
> extends Omit<DynamoDBBatchWriteItemOutput, "UnprocessedItems"> {
  UnprocessedItems?: {
    [TableName: string]: Array<{
      PutRequest?: {
        Item: FormatObject<Item, Format>;
      };
      DeleteRequest?: {
        Key: TableKey<Item, PartitionKey, RangeKey, Format>;
      };
    }>;
  };
}

export type BatchWriteCommand<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Format extends JsonFormat,
> = new (
  input: BatchWriteItemInput<Item, PartitionKey, RangeKey, Format>,
) => Command<
  BatchWriteItemInput<Item, PartitionKey, RangeKey, Format>,
  BatchWriteItemOutput<Item, PartitionKey, RangeKey, Format> & MetadataBearer,
  DynamoDBClientResolvedConfig
> & {
  _brand: "BatchWriteItemCommand";
};
