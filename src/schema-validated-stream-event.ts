import { z } from "zod";
import { marshall, unmarshall } from "./marshall";
import type { DynamoDBStreamEvent, DynamoDBRecord } from "./stream-event";

export function validateStreamEvent<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  StreamViewType extends Exclude<
    import("aws-lambda").StreamRecord["StreamViewType"],
    undefined
  >,
>(
  event: DynamoDBStreamEvent<Item, PartitionKey, RangeKey, StreamViewType>,
  schema: z.ZodSchema<Item>,
): DynamoDBStreamEvent<Item, PartitionKey, RangeKey, StreamViewType> {
  return {
    ...event,
    Records: event.Records.map((record) =>
      validateStreamRecord(record, schema),
    ),
  };
}

export function validateStreamRecord<
  Item extends object,
  PartitionKey extends keyof Item,
  RangeKey extends keyof Item | undefined,
  StreamViewType extends
    import("aws-lambda").StreamRecord["StreamViewType"] = undefined,
>(
  record: DynamoDBRecord<Item, PartitionKey, RangeKey, StreamViewType>,
  schema: z.ZodSchema<Item>,
): DynamoDBRecord<Item, PartitionKey, RangeKey, StreamViewType> {
  if (!record.dynamodb) {
    return record;
  }

  const validatedRecord = { ...record };
  const dynamodb = record.dynamodb as any;

  if (dynamodb.NewImage) {
    const unmarshalled = unmarshall(dynamodb.NewImage);
    const validated = schema.parse(unmarshalled);
    (validatedRecord.dynamodb as any).NewImage = marshall(validated);
  }

  if (dynamodb.OldImage) {
    const unmarshalled = unmarshall(dynamodb.OldImage);
    const validated = schema.parse(unmarshalled);
    (validatedRecord.dynamodb as any).OldImage = marshall(validated);
  }

  return validatedRecord;
}
