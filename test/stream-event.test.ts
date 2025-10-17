import { expect, it } from "vitest";
import { DynamoDBStreamEvent } from "../src/stream-event.js";

interface MyType {
  id: string;
  sort: number;
  children?: MyType[];
}

it("should pass dummy test", () => {
  expect(1).toBe(1);
});

export function handle_keys_only(
  event: DynamoDBStreamEvent<MyType, "id", "sort", "KEYS_ONLY">,
) {
  for (const record of event.Records) {
    record.dynamodb?.Keys;
    // @ts-expect-error
    record.dynamodb?.NewImage;
    // @ts-expect-error
    record.dynamodb?.OldImage;
  }
}

export function handle_new_image(
  event: DynamoDBStreamEvent<MyType, "id", "sort", "NEW_IMAGE">,
) {
  for (const record of event.Records) {
    record.dynamodb?.Keys;
    record.dynamodb?.NewImage;
    // @ts-expect-error
    record.dynamodb?.OldImage;
  }
}

export function handle_old_image(
  event: DynamoDBStreamEvent<MyType, "id", "sort", "OLD_IMAGE">,
) {
  for (const record of event.Records) {
    record.dynamodb?.Keys;
    // @ts-expect-error
    record.dynamodb?.NewImage;
    record.dynamodb?.OldImage;
  }
}

export function handle_new_and_old_images(
  event: DynamoDBStreamEvent<MyType, "id", "sort", "NEW_AND_OLD_IMAGES">,
) {
  for (const record of event.Records) {
    record.dynamodb?.Keys;
    record.dynamodb?.NewImage;
    record.dynamodb?.OldImage;
  }
}
