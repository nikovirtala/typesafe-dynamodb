import type {
  DynamoDB,
  ReturnValue as DynamoDBReturnValue,
} from "@aws-sdk/client-dynamodb";
import { MetadataBearer } from "@aws-sdk/types";
import { DeleteItemInput, DeleteItemOutput } from "./delete-item.js";
import { GetItemInput, GetItemOutput } from "./get-item.js";
import { JsonFormat } from "./json-format.js";
import { TableKey } from "./key.js";
import { PutItemInput, PutItemOutput } from "./put-item.js";
import { QueryInput, QueryOutput } from "./query.js";
import { ScanInput, ScanOutput } from "./scan.js";
import { UpdateItemInput, UpdateItemOutput } from "./update-item.js";

export interface TypeSafeDynamoDBv3<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined = undefined,
> extends Omit<
    DynamoDB,
    "getItem" | "deleteItem" | "putItem" | "updateItem" | "query" | "scan"
  > {
  getItem<
    Key extends TableKey<
      Item,
      PartitionKey,
      RangeKey,
      JsonFormat.AttributeValue
    >,
    AttributesToGet extends keyof Item | undefined = undefined,
    ProjectionExpression extends string | undefined = undefined,
  >(
    params: GetItemInput<
      Item,
      PartitionKey,
      RangeKey,
      Key,
      AttributesToGet,
      ProjectionExpression,
      JsonFormat.AttributeValue
    >,
  ): Promise<
    GetItemOutput<
      Item,
      PartitionKey,
      RangeKey,
      Key,
      AttributesToGet,
      ProjectionExpression,
      JsonFormat.AttributeValue
    > &
      MetadataBearer
  >;

  deleteItem<
    Key extends TableKey<
      Item,
      PartitionKey,
      RangeKey,
      JsonFormat.AttributeValue
    >,
    ConditionExpression extends string | undefined,
    ReturnValue extends DynamoDBReturnValue = "NONE",
  >(
    params: DeleteItemInput<
      Item,
      PartitionKey,
      RangeKey,
      Key,
      ConditionExpression,
      ReturnValue,
      JsonFormat.AttributeValue
    >,
  ): Promise<
    DeleteItemOutput<Item, ReturnValue, JsonFormat.AttributeValue> &
      MetadataBearer
  >;

  putItem<
    ConditionExpression extends string | undefined,
    ReturnValue extends DynamoDBReturnValue = "NONE",
  >(
    params: PutItemInput<
      Item,
      ConditionExpression,
      ReturnValue,
      JsonFormat.AttributeValue
    >,
  ): Promise<
    PutItemOutput<Item, ReturnValue, JsonFormat.AttributeValue> & MetadataBearer
  >;

  updateItem<
    Key extends TableKey<
      Item,
      PartitionKey,
      RangeKey,
      JsonFormat.AttributeValue
    >,
    UpdateExpression extends string,
    ConditionExpression extends string | undefined,
    ReturnValue extends DynamoDBReturnValue = "NONE",
  >(
    params: UpdateItemInput<
      Item,
      PartitionKey,
      RangeKey,
      Key,
      UpdateExpression,
      ConditionExpression,
      ReturnValue,
      JsonFormat.AttributeValue
    >,
  ): Promise<
    UpdateItemOutput<
      Item,
      PartitionKey,
      RangeKey,
      Key,
      ReturnValue,
      JsonFormat.AttributeValue
    > &
      MetadataBearer
  >;

  updateItem<
    Key extends TableKey<
      Item,
      PartitionKey,
      RangeKey,
      JsonFormat.AttributeValue
    >,
    UpdateExpression extends string,
    ConditionExpression extends string | undefined,
    ReturnValue extends DynamoDBReturnValue = "NONE",
  >(
    params: UpdateItemInput<
      Item,
      PartitionKey,
      RangeKey,
      Key,
      UpdateExpression,
      ConditionExpression,
      ReturnValue,
      JsonFormat.AttributeValue
    >,
  ): Promise<
    UpdateItemOutput<
      Item,
      PartitionKey,
      RangeKey,
      Key,
      ReturnValue,
      JsonFormat.AttributeValue
    > &
      MetadataBearer
  >;

  query<
    KeyConditionExpression extends string | undefined = undefined,
    FilterExpression extends string | undefined = undefined,
    ProjectionExpression extends string | undefined = undefined,
    AttributesToGet extends keyof Item | undefined = undefined,
  >(
    params: QueryInput<
      Item,
      KeyConditionExpression,
      FilterExpression,
      ProjectionExpression,
      AttributesToGet,
      JsonFormat.AttributeValue
    >,
  ): Promise<
    QueryOutput<Item, AttributesToGet, JsonFormat.AttributeValue> &
      MetadataBearer
  >;

  scan<
    FilterExpression extends string | undefined = undefined,
    ProjectionExpression extends string | undefined = undefined,
    AttributesToGet extends keyof Item | undefined = undefined,
  >(
    params: ScanInput<
      Item,
      FilterExpression,
      ProjectionExpression,
      AttributesToGet,
      JsonFormat.Document
    >,
  ): Promise<
    ScanOutput<Item, AttributesToGet, JsonFormat.AttributeValue> &
      MetadataBearer
  >;

  scan<
    FilterExpression extends string | undefined = undefined,
    ProjectionExpression extends string | undefined = undefined,
    AttributesToGet extends keyof Item | undefined = undefined,
  >(
    params: ScanInput<
      Item,
      FilterExpression,
      ProjectionExpression,
      AttributesToGet,
      JsonFormat.AttributeValue
    >,
  ): Promise<
    ScanOutput<Item, AttributesToGet, JsonFormat.AttributeValue> &
      MetadataBearer
  >;
}
