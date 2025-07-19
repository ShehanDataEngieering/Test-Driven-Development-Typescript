/**
 * Mock implementations for ValidationUtils
 */

export const validateUserInput = jest.fn();
export const validateOptionalField = jest.fn();
export const isValidEmail = jest.fn().mockReturnValue(true);
