import { type ZodIssue, z } from "zod";

type ValidationSuccess<T> = {
  success: true;
  data: T;
  error?: never;
};

type ValidationError = {
  success: false;
  data?: never;
  error: ZodIssue[];
};

type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

/**
 * Validate user input against a Zod schema.
 * If the input is invalid, return a 400 Bad Request response.
 *
 * @param schema - The Zod schema to validate against.
 * @param input - The input to validate.
 * @returns The validated input or validation errors.
 */
export async function validateUserInput<T>(
  schema: z.ZodSchema<T>,
  input: Promise<unknown>,
): Promise<ValidationResult<T>> {
  try {
    const value = await input;
    const data = schema.parse(value);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues };
    }
    throw error;
  }
}
