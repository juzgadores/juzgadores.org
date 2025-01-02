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
  const numericKeys = getZodSchemaNumericKeys(schema);

  console.log(numericKeys, "NUMERIC KEYS");
  // Transform the input value for numeric keys
  const transformedValue = Object.entries(await params).reduce(
    (acc, [key, val]) => {
      if (numericKeys.includes(key)) {
        acc[key] = Number(val);
      } else {
        acc[key] = val;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );

  try {
    const data = schema.parse(transformedValue);
    return { success: true, data } as ValidationResult<z.infer<T>>;
  } catch (error) {
    return {
      success: false,
      error: error instanceof z.ZodError ? error.issues : [],
    };
  }
}

function getZodSchemaNumericKeys(schema: z.ZodObject<any>): string[] {
  const shape = schema.shape;

  const numericKeys = Object.keys(shape).filter((key) => {
    const propType = shape[key]._def.innerType;
    return propType instanceof z.ZodNumber;
  });

  return numericKeys;
}
