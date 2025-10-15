import { z } from "zod";
import { validateStreamEvent } from "../src/schema-validated-stream-event";
import type { DynamoDBStreamEvent } from "../src/stream-event";

const UserSchema = z.object({
  pk: z.templateLiteral(["USER", "#", z.string()]),
  sk: z.literal("PROFILE"),
  userId: z.string(),
  email: z.string().email(),
  name: z.string(),
  age: z.number().min(0),
  preferences: z.object({
    theme: z.enum(["light", "dark"]),
    notifications: z.boolean(),
  }),
});

type User = z.infer<typeof UserSchema>;

export async function handleUserStreamEvent(
  event: DynamoDBStreamEvent<User, "pk", "sk", "NEW_AND_OLD_IMAGES">,
) {
  try {
    const validatedEvent = validateStreamEvent(event, UserSchema);

    for (const record of validatedEvent.Records) {
      console.log(`Processing ${record.eventName} event for ${record.eventID}`);

      if (record.dynamodb?.NewImage) {
        console.log("New user data validated successfully");
      }

      if (record.dynamodb?.OldImage) {
        console.log("Old user data validated successfully");
      }

      switch (record.eventName) {
        case "INSERT":
          console.log("User created");
          break;
        case "MODIFY":
          console.log("User updated");
          break;
        case "REMOVE":
          console.log("User deleted");
          break;
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Schema validation failed:", error.issues);
      throw new Error(`Invalid stream data: ${error.message}`);
    } else {
      console.error("Stream processing error:", error);
      throw error;
    }
  }
}

export { UserSchema };
