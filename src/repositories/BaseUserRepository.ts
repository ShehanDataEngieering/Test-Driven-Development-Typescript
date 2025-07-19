import { User, CreateUserInput, UpdateUserInput } from "../types/User";
import {
  handleDbError,
  handleNotFoundError,
  validateRequired,
} from "../utils/ErrorHandlers";
import { validateUserInput, validateOptionalField, isValidEmail } from "../utils/ValidationUtils";
import { generateId, mapRowToUser } from "../utils/DataUtils";

export abstract class BaseUserRepository {
  abstract create(input: CreateUserInput): Promise<User>;
  abstract findById(id: string): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract update(id: string, input: UpdateUserInput): Promise<User>;
  abstract delete(id: string): Promise<boolean>;
  // This is kept as nullable specifically because it's used for checking existence
  abstract findByEmail(email: string): Promise<User | null>;

  // Proxy methods to utility functions
  protected validateOptionalField = validateOptionalField;
  public validateCreateInput = validateUserInput;
  public isValidEmail = isValidEmail;
  public generateId = generateId;
  public mapRowToUser = mapRowToUser;

  protected handleDbError = handleDbError;
  protected handleNotFoundError = handleNotFoundError;
  protected validateRequired = validateRequired;
}
