/**
 * Mock implementations for ErrorHandlers
 */

export const handleDbError = jest.fn().mockImplementation((operation, error) => {
  throw new Error(
    `${operation}: ${error instanceof Error ? error.message : String(error)}`
  );
});

export const handleNotFoundError = jest.fn().mockImplementation((operation, error) => {
  // For tests, we'll preserve the error message format like handleDbError
  throw new Error(
    `${operation}: ${error instanceof Error ? error.message : String(error)}`
  );
});

export const validateRequired = jest.fn().mockImplementation((value, name) => {
  if (!value) {
    throw new Error(`${name} is required`);
  }
});
