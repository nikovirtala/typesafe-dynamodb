// @ts-nocheck - disabling so we can publish types that work with document client

import "jest";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { TypeSafeDeleteItemCommand } from "../src/delete-item-command";
import { TypeSafeGetItemCommand } from "../src/get-item-command";
import { TypeSafePutItemCommand } from "../src/put-item-command";
import { TypeSafeQueryCommand } from "../src/query-command";
import { TypeSafeUpdateItemCommand } from "../src/update-item-command";

interface MyType {
  key: string;
  sort: number;
  list: string[];
}

const client = new DynamoDBClient({});

const PutItemCommand = TypeSafePutItemCommand<MyType>();
const UpdateItemCommand = TypeSafeUpdateItemCommand<MyType, "key", "sort">();
const GetItemCommand = TypeSafeGetItemCommand<MyType, "key", "sort">();
const DeleteItemCommand = TypeSafeDeleteItemCommand<MyType, "key", "sort">();
const QueryCommand = TypeSafeQueryCommand<MyType>();

it("dummy", () => {
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
