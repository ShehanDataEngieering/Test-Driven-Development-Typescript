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
    let result;
    try {
      result = await this.db.query(query, values);
      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      // Log error or handle as needed
      throw new Error(
        `Failed to create user: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async findById(id: string): Promise<User | null> {
    const query = this.sqlLoader.loadQuery("findUserById");
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  async findAll(): Promise<User[]> {
    const query = this.sqlLoader.loadQuery("findAllUsers");
    const result = await this.db.query(query);

    return result.rows.map((row) => this.mapRowToUser(row));
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    // Validate input if provided
    if (input.name !== undefined && input.name !== null) {
      if (!input.name || input.name.trim() === "") {
        throw new Error("Name cannot be empty");
      }
    }

    if (input.email !== undefined && input.email !== null) {
      if (!input.email || input.email.trim() === "") {
        throw new Error("Email cannot be empty");
      }
      if (!this.isValidEmail(input.email)) {
        throw new Error("Invalid email format");
      }

      // Check for duplicate email (excluding current user)
      const existingUser = await this.findByEmail(input.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email already exists");
      }
    }

    const query = this.sqlLoader.loadQuery("updateUser");
    const values = [id, input.name || null, input.email || null, new Date()];

    const result = await this.db.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const query = this.sqlLoader.loadQuery("deleteUser");
    const result = await this.db.query(query, [id]);

    return (result.rowCount || 0) > 0;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const query = this.sqlLoader.loadQuery("findUserByEmail");
    const result = await this.db.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  public mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
