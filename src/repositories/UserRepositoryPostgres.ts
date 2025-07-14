import { User, CreateUserInput, UpdateUserInput } from '../types/User';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { v4 as uuidv4 } from 'uuid';

export class UserRepositoryPostgres {
  constructor(private db: DatabaseConnection) {}

  async create(input: CreateUserInput): Promise<User> {
    // Validate input (same validation as in-memory version)
    this.validateCreateInput(input);

    const user: User = {
      id: this.generateId(),
      name: input.name,
      email: input.email,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into PostgreSQL database
    const query = `
      INSERT INTO users (id, name, email, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [user.id, user.name, user.email, user.createdAt, user.updatedAt];
    const result = await this.db.query(query, values);
    
    return this.mapRowToUser(result.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToUser(result.rows[0]);
  }

  async findAll(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY created_at ASC';
    const result = await this.db.query(query);
    
    return result.rows.map((row: any) => this.mapRowToUser(row));
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    // Check if user exists
    const existingUser = await this.findById(id);
    if (!existingUser) {
      return null;
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (input.name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      values.push(input.name);
      paramCount++;
    }

    if (input.email !== undefined) {
      updateFields.push(`email = $${paramCount}`);
      values.push(input.email);
      paramCount++;
    }

    updateFields.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    paramCount++;

    values.push(id); // Add id as last parameter

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.db.query(query, [id]);
    
    return result.rowCount > 0;
  }

  private validateCreateInput(input: CreateUserInput): void {
    if (!input.name || input.name.trim() === '') {
      throw new Error('Name cannot be empty');
    }

    if (!input.email || input.email.trim() === '') {
      throw new Error('Email cannot be empty');
    }

    if (!this.isValidEmail(input.email)) {
      throw new Error('Invalid email format');
  }
}

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateId(): string {
    return uuidv4();
  }
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}

