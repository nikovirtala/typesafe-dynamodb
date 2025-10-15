import "jest";
import { z } from "zod";
import {
  validateStreamEvent,
  validateStreamRecord,
} from "../src/schema-validated-stream-event";
import type { DynamoDBStreamEvent, DynamoDBRecord } from "../src/stream-event";

const UserSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  name: z.string(),
  age: z.number(),
});

type User = z.infer<typeof UserSchema>;

const mockStreamRecord: DynamoDBRecord<User, "pk", "sk", "NEW_AND_OLD_IMAGES"> =
  {
    eventID: "test-event-id",
    eventName: "INSERT",
    eventVersion: "1.1",
    eventSource: "aws:dynamodb",
    awsRegion: "eu-west-1",
    dynamodb: {
      Keys: {
        pk: { S: "USER#123" },
        sk: { S: "PROFILE" },
      },
      NewImage: {
        pk: { S: "USER#123" },
        sk: { S: "PROFILE" },
        name: { S: "John Doe" },
        age: { N: "30" },
      },
      OldImage: {
        pk: { S: "USER#123" },
        sk: { S: "PROFILE" },
        name: { S: "Jane Doe" },
        age: { N: "25" },
      },
      SequenceNumber: "123456789",
      SizeBytes: 100,
    },
  };

const mockStreamEvent: DynamoDBStreamEvent<
  User,
  "pk",
  "sk",
  "NEW_AND_OLD_IMAGES"
> = {
  Records: [mockStreamRecord],
};

describe("validateStreamEvent", () => {
  it("should validate stream event with valid data", () => {
    const result = validateStreamEvent(mockStreamEvent, UserSchema);
    expect(result.Records).toHaveLength(1);
    expect(result.Records[0].dynamodb?.NewImage).toBeDefined();
    expect(result.Records[0].dynamodb?.OldImage).toBeDefined();
  });

  it("should throw validation error for invalid data", () => {
    const invalidRecord = {
      ...mockStreamRecord,
      dynamodb: {
        ...mockStreamRecord.dynamodb!,
        NewImage: {
          pk: { S: "USER#123" },
          sk: { S: "PROFILE" },
          name: { S: "John Doe" },
          age: { S: "invalid-age" }, // Invalid: should be number
        },
      },
    };

    const invalidEvent = { Records: [invalidRecord] };

    expect(() => validateStreamEvent(invalidEvent as any, UserSchema)).toThrow(
      z.ZodError,
    );
  });
});

describe("validateStreamRecord", () => {
  it("should validate record with NewImage and OldImage", () => {
    const result = validateStreamRecord(mockStreamRecord, UserSchema);
    expect(result.dynamodb?.NewImage).toBeDefined();
    expect(result.dynamodb?.OldImage).toBeDefined();
  });

  it("should handle record without dynamodb field", () => {
    const recordWithoutDynamodb: DynamoDBRecord<User, "pk", "sk"> = {
      ...mockStreamRecord,
      dynamodb: undefined,
    };
    const result = validateStreamRecord(recordWithoutDynamodb, UserSchema);
    expect(result).toEqual(recordWithoutDynamodb);
  });

  it("should validate only NewImage when OldImage is not present", () => {
    const recordWithOnlyNewImage: DynamoDBRecord<
      User,
      "pk",
      "sk",
      "NEW_IMAGE"
    > = {
      ...mockStreamRecord,
      dynamodb: {
        Keys: {
          pk: { S: "USER#123" },
          sk: { S: "PROFILE" },
        },
        NewImage: {
          pk: { S: "USER#123" },
          sk: { S: "PROFILE" },
          name: { S: "John Doe" },
          age: { N: "30" },
        },
        SequenceNumber: "123456789",
        SizeBytes: 100,
      },
    };

    const result = validateStreamRecord(recordWithOnlyNewImage, UserSchema);
    expect(result.dynamodb?.NewImage).toBeDefined();
  });
});
