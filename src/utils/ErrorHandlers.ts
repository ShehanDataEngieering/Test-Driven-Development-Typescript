/**
 * Centralized error handler for database operations
 * @param operation Description of the operation that failed
 * @param error The caught error object
 * @param customHandler Optional function to handle specific error cases
 * @param isNotFound Optional flag to indicate if this is a "not found" error
 * @throws Error with formatted error message
 */
export function handleDbError(
  operation: string,
  error: unknown,
  customHandler?: (err: Error) => Error | undefined,
  isNotFound?: boolean
): never {
  // If it's a custom error with a specific message pattern that needs special handling
  if (error instanceof Error && customHandler) {
    const customError = customHandler(error);
    if (customError) {
      throw customError;
    }
  }

  // For not found errors, use a specific message format
  if (
    isNotFound ||
    (error instanceof Error && error.message.includes("not found"))
  ) {
    throw new Error(`${operation}: Resource not found`);
  }

  // Default error handling
  throw new Error(
    `${operation}: ${error instanceof Error ? error.message : String(error)}`
  );
}

/**
 * Helper for "not found" errors - always treats the error as a "not found" error
 * @param operation The operation description
 * @param error The caught error
 */
export function handleNotFoundError(operation: string, error: unknown): never {
  handleDbError(operation, error, undefined, true); // Pass isNotFound=true
}

/**
 * Helper for validating required parameters
 * @param value The value to check
 * @param name Parameter name for the error message
 */
export function validateRequired(
  value: string | undefined | null,
  name: string
): void {
  if (!value) {
    throw new Error(`${name} is required`);
  }
}
