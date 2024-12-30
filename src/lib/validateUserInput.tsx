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
 * @param params - The input to validate.
 * @returns The validated input or validation errors.
 */

export async function validateRequestParams<T extends z.ZodObject<any>>(
  schema: T,
  params: Promise<Record<string, string | string[] | undefined>>,
): Promise<ValidationResult<z.infer<T>>> {
  try {
    const value = await params;

    // Convert string values to numbers for numeric fields
    if (typeof value === "object") {
      const transformedValue = Object.entries(value).reduce(
        (acc, [key, val]) => {
          if (!isNaN(Number(val))) {
            acc[key] = Number(val);
          } else {
            acc[key] = val;
          }
          return acc;
        },
        {} as Record<string, unknown>,
      );

      const data = schema.parse(transformedValue);
      return { success: true, data };
    }

    const data = schema.parse(value);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues };
    }
    throw error;
  }
}
