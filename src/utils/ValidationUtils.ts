import { CreateUserInput, UpdateUserInput } from "../types/User";

/**
 * Validates fields in user input for creation and update operations
 * @param input The input data to validate
 * @throws Error if validation fails
 */
export function validateUserInput(input: CreateUserInput | UpdateUserInput): void {
  if (!input.name || input.name.trim() === "") {
    throw new Error("Name cannot be empty");
  }

  if (!input.email || input.email.trim() === "") {
    throw new Error("Email cannot be empty");
  }

  if (!isValidEmail(input.email)) {
    throw new Error("Invalid email format");
  }
}

/**
 * Validates an email address format
 * @param email The email address to validate
 * @returns True if the email format is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates fields only if they are provided in the input
 * @param field The field value to check
 * @param fieldName Name of the field for error messages
 * @param validator Optional custom validation function
 */
export function validateOptionalField(
  field: string | undefined | null,
  fieldName: string,
  validator?: (value: string) => boolean
): void {
  // Only validate if the field was provided (not undefined/null)
  if (field !== undefined && field !== null) {
    if (!field || field.trim() === "") {
      throw new Error(`${fieldName} cannot be empty`);
    }

    // Run optional custom validator if provided
    if (validator && !validator(field)) {
      throw new Error(`Invalid ${fieldName.toLowerCase()} format`);
    }
  }
}
