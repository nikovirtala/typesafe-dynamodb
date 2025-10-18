// @ts-nocheck - disabling so we can publish types that work with document client

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { it, expect } from "vitest";

import { TypeSafeBatchWriteItemCommand } from "../src/batch-write-item-command.js";
import { TypeSafeDeleteItemCommand } from "../src/delete-item-command.js";
import { TypeSafeGetItemCommand } from "../src/get-item-command.js";
import { TypeSafePutItemCommand } from "../src/put-item-command.js";
import { TypeSafeQueryCommand } from "../src/query-command.js";
import { TypeSafeUpdateItemCommand } from "../src/update-item-command.js";

interface MyType {
  key: string;
  sort: number;
  list: string[];
}

const client = new DynamoDBClient({});

const BatchWriteItemCommand = TypeSafeBatchWriteItemCommand<
  MyType,
  "key",
  "sort"
>();
const PutItemCommand = TypeSafePutItemCommand<MyType>();
const UpdateItemCommand = TypeSafeUpdateItemCommand<MyType, "key", "sort">();
const GetItemCommand = TypeSafeGetItemCommand<MyType, "key", "sort">();
const DeleteItemCommand = TypeSafeDeleteItemCommand<MyType, "key", "sort">();
const QueryCommand = TypeSafeQueryCommand<MyType>();

it("should pass dummy test", () => {
  expect(1).toBe(1);
});

export async function foo() {
  const getCommand = new GetItemCommand({
    TableName: "",
    Key: {
      key: {
        S: "",
      },
      sort: {
        N: "1",
      },
    },
    ProjectionExpression: "sort, key",
  });
  const get = await client.send(getCommand);

  get.Item?.key;
  // @ts-expect-error
  get.Item?.list;

  const put = await client.send(
    new PutItemCommand({
      TableName: "",
      Item: {
        key: {
          S: "",
        },
        list: {
          L: [],
        },
        sort: {
          N: "1",
        },
      },
    }),
  );
  put.Attributes?.key;

  const del = await client.send(
    new DeleteItemCommand({
      TableName: "",
      Key: {
        key: {
          S: "",
        },
        sort: {
          // @ts-expect-error
          S: "",
        },
      },
    }),
  );
  del.Attributes?.key;

  const query = await client.send(
    new QueryCommand({
      TableName: "",
      KeyConditionExpression: "#key = :val",
      AttributesToGet: ["key"],
      ExpressionAttributeNames: {
        "#key": "key",
      },
      ExpressionAttributeValues: {
        ":val": {
          S: "val",
        },
      },
    }),
  );
  query.Items?.[0].key;
}

export async function updateItem() {
  const defaultBehavior = await client.send(
    new UpdateItemCommand({
      TableName: "",
      Key: {
        key: {
          S: "",
        },
        sort: {
          N: "1",
        },
      },
      UpdateExpression: "#k = :v",
      ExpressionAttributeNames: {
        "#k": "list",
      },
      ExpressionAttributeValues: {
        ":v": {
          S: "val",
        },
        ":v2": {
          S: "val2",
        },
      },
      ConditionExpression: "#k = :v2",
    }),
  );
  // @ts-expect-error - default ReturnValues is None
  defaultBehavior.Attributes?.key;

  const returnNone = await client.send(
    new UpdateItemCommand({
      TableName: "",
      Key: {
        key: {
          S: "",
        },
        sort: {
          N: "1",
        },
      },
      UpdateExpression: "a = 1",
      ReturnValues: "NONE",
    }),
  );
  // @ts-expect-error - nothing is Returned
  returnNone.Attributes?.key;

  const returnAllNew = await client.send(
    new UpdateItemCommand({
      TableName: "",
      Key: {
        key: {
          S: "",
        },
        sort: {
          N: "1",
        },
      },
      UpdateExpression: "a = 1",
      ReturnValues: "ALL_NEW",
    }),
  );
  returnAllNew.Attributes?.key?.S;

  const returnAllOld = await client.send(
    new UpdateItemCommand({
      TableName: "",
      Key: {
        key: {
          S: "",
        },
        sort: {
          N: "1",
        },
      },
      UpdateExpression: "a = 1",
      ReturnValues: "ALL_OLD",
    }),
  );
  returnAllOld.Attributes?.key?.S;

  const returnUpdatedNew = await client.send(
    new UpdateItemCommand({
      TableName: "",
      Key: {
        key: {
          S: "",
        },
        sort: {
          N: "1",
        },
      },
      UpdateExpression: "a = 1",
      ReturnValues: "UPDATED_NEW",
    }),
  );
  returnUpdatedNew.Attributes?.key?.S;

  const returnUpdatedOld = await client.send(
    new UpdateItemCommand({
      TableName: "",
      Key: {
        key: {
          S: "",
        },
        sort: {
          N: "1",
        },
      },
      UpdateExpression: "a = 1",
      ReturnValues: "UPDATED_OLD",
    }),
  );
  returnUpdatedOld.Attributes?.key?.S;
}

export async function batchWriteItem() {
  const batchWrite = await client.send(
    new BatchWriteItemCommand({
      RequestItems: {
        MyTable: [
          {
            PutRequest: {
              Item: {
                key: { S: "test" },
                sort: { N: "1" },
                list: { L: [{ S: "item1" }] },
              },
            },
          },
          {
            DeleteRequest: {
              Key: {
                key: { S: "delete-key" },
                sort: { N: "2" },
              },
            },
          },
        ],
      },
    }),
  );

  batchWrite.UnprocessedItems?.MyTable?.[0]?.PutRequest?.Item.key?.S;
  batchWrite.UnprocessedItems?.MyTable?.[0]?.DeleteRequest?.Key.key?.S;
}
