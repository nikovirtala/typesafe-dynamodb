import type {
  GetItemInput as DynamoDBGetItemInput,
  GetItemOutput as DynamoDBGetItemOutput,
} from "@aws-sdk/client-dynamodb";
import { JsonFormat, FormatObject } from "./json-format.js";
import { TableKey } from "./key.js";
import { Narrow } from "./narrow.js";
import { ApplyProjection } from "./projection.js";
import { Simplify } from "./simplify.js";

export interface GetItemInput<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Key extends TableKey<Item, PartitionKey, RangeKey, Format>,
  AttributesToGet extends keyof Item | undefined,
  ProjectionExpression extends string | undefined,
  Format extends JsonFormat,
> extends Omit<
    DynamoDBGetItemInput,
    "Key" | "AttributesToGet" | "ProjectionExpression"
  > {
  Key: Key;
  AttributesToGet?: readonly AttributesToGet[] | AttributesToGet[];
  ProjectionExpression?: ProjectionExpression;
}

export interface GetItemOutput<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  Key extends TableKey<Item, PartitionKey, RangeKey, Format>,
  AttributesToGet extends keyof Item | undefined,
  ProjectionExpression extends string | undefined,
  Format extends JsonFormat = JsonFormat.AttributeValue,
> extends Omit<DynamoDBGetItemOutput, "Item"> {
  Item?: Simplify<
    FormatObject<
      undefined extends AttributesToGet
        ? undefined extends ProjectionExpression
          ? Narrow<Item, Extract<Key, TableKey<Item, any, any, Format>>, Format>
          : Extract<
              ApplyProjection<
                Narrow<
                  Item,
                  Extract<Key, TableKey<Item, any, any, Format>>,
                  Format
                >,
                Extract<ProjectionExpression, string>
              >,
              object
            >
        : Pick<
            Narrow<
              Item,
              Extract<Key, TableKey<Item, any, any, Format>>,
              Format
            >,
            Extract<AttributesToGet, keyof Item>
          >,
      Format
    >
  >;
}
