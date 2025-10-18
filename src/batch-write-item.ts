import type {
  DynamoDBClientResolvedConfig,
  BatchWriteItemInput as DynamoDBBatchWriteItemInput,
  BatchWriteItemOutput as DynamoDBBatchWriteItemOutput,
} from "@aws-sdk/client-dynamodb";
import type { MetadataBearer } from "@aws-sdk/types";
import type { Command } from "@smithy/smithy-client";
import type { FormatObject, JsonFormat } from "./json-format.js";

export type BatchWriteItemInput<
  Item extends object,
  Format extends JsonFormat,
> = Omit<DynamoDBBatchWriteItemInput, "RequestItems"> & {
  RequestItems: {
    [TableName: string]: Array<{
      PutRequest?: {
        Item: FormatObject<Item, Format>;
      };
      DeleteRequest?: {
        Key: Partial<FormatObject<Item, Format>>;
      };
    }>;
  };
};

export interface BatchWriteItemOutput<
  Item extends object,
  Format extends JsonFormat,
> extends Omit<DynamoDBBatchWriteItemOutput, "UnprocessedItems"> {
  UnprocessedItems?: {
    [TableName: string]: Array<{
      PutRequest?: {
        Item: FormatObject<Item, Format>;
      };
      DeleteRequest?: {
        Key: Partial<FormatObject<Item, Format>>;
      };
    }>;
  };
}

export type BatchWriteCommand<
  Item extends object,
  Format extends JsonFormat,
> = new (input: BatchWriteItemInput<Item, Format>) => Command<
  BatchWriteItemInput<Item, Format>,
  BatchWriteItemOutput<Item, Format> & MetadataBearer,
  DynamoDBClientResolvedConfig
> & {
  _brand: "BatchWriteItemCommand";
};
