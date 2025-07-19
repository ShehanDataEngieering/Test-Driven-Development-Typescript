import { pool } from "../database/connection";
import { User, CreateUserInput, UpdateUserInput } from "../types/User";
import { BaseUserRepository } from "./BaseUserRepository";
import { SQLQueryLoader } from "../database/SQLQueryLoader";

export class UserRepository extends BaseUserRepository {
  private sqlLoader: SQLQueryLoader;

  constructor(private db = pool, sqlLoader?: SQLQueryLoader) {
    super();
    this.sqlLoader = sqlLoader || new SQLQueryLoader();
  }

  async create(input: CreateUserInput): Promise<User> {
    // Use inherited validation
    this.validateCreateInput(input);

    const existingUser = await this.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const user: User = {
      id: this.generateId(), // Use inherited method
      name: input.name,
      email: input.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const query = this.sqlLoader.loadQuery("createUser");
    const values = [
      user.id,
      user.name,
      user.email,
      user.createdAt,
      user.updatedAt,
    ];

    try {
      const result = await this.db.query(query, values);
      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      // Use centralized error handling - this will always throw
      return this.handleDbError("Failed to create user", error);
    }
  }

  async findById(id: string): Promise<User> {
    this.validateRequired(id, "User ID");

    const query = this.sqlLoader.loadQuery("findUserById");

    try {
      const result = await this.db.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error(`User with id ${id} not found`);
      }
      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      // Use specialized handler for not found errors - this will always throw
      return this.handleNotFoundError("Failed to find user", error);
    }
  }

  async findAll(): Promise<User[]> {
    const query = this.sqlLoader.loadQuery("findAllUsers");

    try {
      const result = await this.db.query(query);
      return result.rows.map((row) => this.mapRowToUser(row));
    } catch (error) {
      // Use centralized error handling - this will always throw
      return this.handleDbError("Failed to find all users", error);
    }
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    this.validateRequired(id, "User ID");

    // Validate optional fields if provided
    this.validateOptionalField(input.name, "Name");
    this.validateOptionalField(input.email, "Email", (email) =>
      this.isValidEmail(email)
    );

    // Check for duplicate email (excluding current user)
    if (input.email !== undefined && input.email !== null) {
      const existingUser = await this.findByEmail(input.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email already exists");
      }
    }

    const query = this.sqlLoader.loadQuery("updateUser");
    const values = [id, input.name || null, input.email || null, new Date()];

    try {
      const result = await this.db.query(query, values);

      if (result.rows.length === 0) {
        throw new Error(`User with id ${id} not found`);
      }

      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      // Use specialized handler for not found errors - this will always throw
      return this.handleNotFoundError("Failed to update user", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    this.validateRequired(id, "User ID");

    const query = this.sqlLoader.loadQuery("deleteUser");

    try {
      const result = await this.db.query(query, [id]);
      return (result.rowCount || 0) > 0;
    } catch (error) {
      // Use centralized error handling - this will always throw
      return this.handleDbError("Failed to delete user", error);
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    this.validateRequired(email, "Email");

    const query = this.sqlLoader.loadQuery("findUserByEmail");

    try {
      const result = await this.db.query(query, [email]);

      // Special case: we use null for email lookups because we use it for checking
      // if a user exists during registration. This is an expected path, not an error.
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      // Use centralized error handling - this will always throw
      return this.handleDbError("Failed to find user by email", error);
    }
  }
}
