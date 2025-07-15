import { pool } from "../database/connection"; //  Import connection
import { User, CreateUserInput, UpdateUserInput } from "../types/User";
import { BaseUserRepository } from "./BaseUserRepository";

export class UserRepositoryPostgres extends BaseUserRepository {
  constructor(private db = pool) {
    super();
  }

  async create(input: CreateUserInput): Promise<User> {
    this.validateCreateInput(input);

    const existingUser = await this.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const user: User = {
      id: this.generateId(),
      name: input.name,
      email: input.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const query = `
      INSERT INTO users (id, name, email, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      user.id,
      user.name,
      user.email,
      user.createdAt,
      user.updatedAt,
    ];
    const result = await this.db.query(query, values);

    return this.mapRowToUser(result.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    // TODO: Implement findById method
    throw new Error("Method not implemented");
  }

  async findAll(): Promise<User[]> {
    // TODO: Implement findAll method
    throw new Error("Method not implemented");
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    // TODO: Implement update method
    throw new Error("Method not implemented");
  }

  async delete(id: string): Promise<boolean> {
    // TODO: Implement delete method
    throw new Error("Method not implemented");
  }

  private async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await this.db.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
