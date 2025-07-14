import { UserRepositoryPostgres } from '../repositories/UserRepositoryPostgres';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { CreateUserInput, UpdateUserInput } from '../types/User';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

describe('UserRepository Integration Tests (PostgreSQL with Testcontainers)', () => {
  let userRepository: UserRepositoryPostgres;
  let db: DatabaseConnection;
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    // Start PostgreSQL container with Testcontainers
    if (process.env.VERBOSE === 'true') {
      console.log('🚀 Starting PostgreSQL container...');
    }
    postgresContainer = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('tdd_test')
      .withUsername('testuser')
      .withPassword('testpass')
      .withExposedPorts(5432)
      .start();

    if (process.env.VERBOSE === 'true') {
      console.log('✅ PostgreSQL container started');
      console.log(`📊 Container details:`);
      console.log(`  - Host: ${postgresContainer.getHost()}`);
      console.log(`  - Port: ${postgresContainer.getFirstMappedPort()}`);
      console.log(`  - Database: ${postgresContainer.getDatabase()}`);
      console.log(`  - Username: ${postgresContainer.getUsername()}`);
    }

    // Override environment variables for this container
    process.env.DB_HOST = postgresContainer.getHost();
    process.env.DB_PORT = postgresContainer.getFirstMappedPort().toString();
    process.env.DB_NAME = postgresContainer.getDatabase();
    process.env.DB_USER = postgresContainer.getUsername();
    process.env.DB_PASSWORD = postgresContainer.getPassword();

    // Setup database connection
    db = new DatabaseConnection();
    userRepository = new UserRepositoryPostgres(db);
    
    // Create tables
    await db.createTables();
    if (process.env.VERBOSE === 'true') {
      console.log('🗃️ Database tables created');
    }
  });

  afterAll(async () => {
    // Close database connection
    if (process.env.VERBOSE === 'true') {
      console.log('🔌 Closing database connection...');
    }
    await db.close();
    
    // Stop PostgreSQL container
    if (process.env.VERBOSE === 'true') {
      console.log('🛑 Stopping PostgreSQL container...');
    }
    await postgresContainer.stop();
    if (process.env.VERBOSE === 'true') {
      console.log('✅ PostgreSQL container stopped');
    }
  });

  beforeEach(async () => {
    // Clear all users before each test
    await db.clearTables();
  });

  describe('create', () => {
    it('should create and persist user to PostgreSQL database', async () => {
      const input: CreateUserInput = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const user = await userRepository.create(input);

      // Verify user object
      expect(user).toMatchObject({
        name: input.name,
        email: input.email
      });
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);

      // Verify actually saved to database
      const dbResult = await db.query('SELECT * FROM users WHERE id = $1', [user.id]);
      expect(dbResult.rows).toHaveLength(1);
      expect(dbResult.rows[0].name).toBe('John Doe');
      expect(dbResult.rows[0].email).toBe('john@example.com');
    });

    it('should handle duplicate email constraint', async () => {
      const input: CreateUserInput = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      // Create first user
      await userRepository.create(input);

      // Try to create user with same email
      const duplicateInput: CreateUserInput = {
        name: 'Jane Doe',
        email: 'john@example.com' // Same email
      };

      await expect(userRepository.create(duplicateInput)).rejects.toThrow();
    });

    it('should throw error when name is empty', async () => {
      const input: CreateUserInput = {
        name: '',
        email: 'john@example.com'
      };

      await expect(userRepository.create(input)).rejects.toThrow('Name cannot be empty');
    });

    it('should generate unique IDs even with container restart', async () => {
      const input1: CreateUserInput = { name: 'User 1', email: 'user1@example.com' };
      const input2: CreateUserInput = { name: 'User 2', email: 'user2@example.com' };

      const user1 = await userRepository.create(input1);
      const user2 = await userRepository.create(input2);

      expect(user1.id).not.toBe(user2.id);

      // Verify both are in database
      const dbResult = await db.query('SELECT COUNT(*) as count FROM users');
      expect(parseInt(dbResult.rows[0].count)).toBe(2);
    });
  });

  describe('findById', () => {
    it('should find user by id from database', async () => {
      const input: CreateUserInput = { name: 'John Doe', email: 'john@example.com' };
      const createdUser = await userRepository.create(input);

      const foundUser = await userRepository.findById(createdUser.id);

      expect(foundUser).toEqual(createdUser);
    });

    it('should return null when user not found in database', async () => {
      const foundUser = await userRepository.findById('non-existent-id');

      expect(foundUser).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return empty array when no users exist in database', async () => {
      const users = await userRepository.findAll();

      expect(users).toEqual([]);
    });

    it('should return all users from database', async () => {
      const input1: CreateUserInput = { name: 'User 1', email: 'user1@example.com' };
      const input2: CreateUserInput = { name: 'User 2', email: 'user2@example.com' };

      const user1 = await userRepository.create(input1);
      const user2 = await userRepository.create(input2);

      const users = await userRepository.findAll();

      expect(users).toHaveLength(2);
      expect(users).toContainEqual(user1);
      expect(users).toContainEqual(user2);
    });
  });

  describe('update', () => {
    it('should update user in database', async () => {
      const input: CreateUserInput = { name: 'John Doe', email: 'john@example.com' };
      const createdUser = await userRepository.create(input);

      const updateInput: UpdateUserInput = { name: 'Jane Doe' };
      const updatedUser = await userRepository.update(createdUser.id, updateInput);

      expect(updatedUser).toMatchObject({
        id: createdUser.id,
        name: 'Jane Doe',
        email: 'john@example.com'
      });
      expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(createdUser.updatedAt.getTime());

      // Verify in database
      const dbResult = await db.query('SELECT * FROM users WHERE id = $1', [createdUser.id]);
      expect(dbResult.rows[0].name).toBe('Jane Doe');
    });

    it('should return null when user not found in database', async () => {
      const updateInput: UpdateUserInput = { name: 'Jane Doe' };
      const updatedUser = await userRepository.update('non-existent-id', updateInput);

      expect(updatedUser).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete user from database', async () => {
      const input: CreateUserInput = { name: 'John Doe', email: 'john@example.com' };
      const createdUser = await userRepository.create(input);

      const deleted = await userRepository.delete(createdUser.id);

      expect(deleted).toBe(true);

      // Verify removed from database
      const dbResult = await db.query('SELECT * FROM users WHERE id = $1', [createdUser.id]);
      expect(dbResult.rows).toHaveLength(0);

      const foundUser = await userRepository.findById(createdUser.id);
      expect(foundUser).toBeNull();
    });

    it('should return false when user not found in database', async () => {
      const deleted = await userRepository.delete('non-existent-id');

      expect(deleted).toBe(false);
    });
  });

  describe('container isolation', () => {
    it('should have fresh database for each test run', async () => {
      // This test verifies that each test run gets a clean database
      const users = await userRepository.findAll();
      
      // Should be empty because beforeEach clears the database
      expect(users).toHaveLength(0);
      
      // Verify we can see the database schema exists
      const tablesResult = await db.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      `);
      expect(tablesResult.rows).toHaveLength(1);
      expect(tablesResult.rows[0].table_name).toBe('users');
    });

    it('should be able to connect to the containerized database', async () => {
      // Test that we can actually connect and query the database
      const result = await db.query('SELECT version()');
      expect(result.rows[0].version).toContain('PostgreSQL');
      
      // Test that we can perform basic operations
      const timeResult = await db.query('SELECT NOW() as current_time');
      expect(timeResult.rows[0].current_time).toBeInstanceOf(Date);
    });
  });
});
