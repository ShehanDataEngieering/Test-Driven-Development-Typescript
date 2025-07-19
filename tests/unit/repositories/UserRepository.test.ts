import { UserRepository } from "../../../src/repositories/UserRepository";
import { CreateUserInput, User } from "../../../src/types/User";
import { pool } from "../../../src/database/connection";

// Mock dependencies before importing them
jest.mock("../../../src/database/connection", () => ({
  pool: { query: jest.fn() },
}));

// Mock all utility functions that BaseUserRepository uses
jest.mock("../../../src/utils/ValidationUtils", () => ({
  validateUserInput: jest.fn(),
  validateOptionalField: jest.fn(),
  isValidEmail: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../src/utils/DataUtils", () => ({
  generateId: jest.fn().mockReturnValue("test-uuid"),
  mapRowToUser: jest.fn((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  })),
}));

jest.mock("../../../src/utils/ErrorHandlers", () => ({
  handleDbError: jest.fn().mockImplementation((operation, error) => {
    throw new Error(
      `${operation}: ${error instanceof Error ? error.message : String(error)}`
    );
  }),
  handleNotFoundError: jest.fn().mockImplementation((operation, error) => {
    throw new Error(
      `${operation}: ${error instanceof Error ? error.message : String(error)}`
    );
  }),
  validateRequired: jest.fn().mockImplementation((value, name) => {
    if (!value) {
      throw new Error(`${name} is required`);
    }
  }),
}));

const mockedPool = pool as jest.Mocked<typeof pool>;

// Common test fixtures shared across tests
const mockId = "test-uuid";
const mockDate = new Date("2023-01-01T00:00:00.000Z");
const mockCreateInput: CreateUserInput = {
  name: "Test User",
  email: "test@example.com",
};

const mockDbRow = {
  id: mockId,
  name: "Test User",
  email: "test@example.com",
  created_at: mockDate.toISOString(),
  updated_at: mockDate.toISOString(),
};

const mockUser = {
  id: mockId,
  name: "Test User",
  email: "test@example.com",
  createdAt: mockDate,
  updatedAt: mockDate,
};

describe("UserRepository", () => {
  describe("create", () => {
    let userRepository: UserRepository;

    // beforeEach runs before each test in this block
    beforeEach(() => {
      // Reset all mocks to ensure test isolation
      jest.clearAllMocks();
      // Use fake timers to control Date() constructor
      jest.useFakeTimers().setSystemTime(mockDate);

      // Create a new instance of the repository for each test
      userRepository = new UserRepository(mockedPool);

      // Mock repository methods that we want to control directly
      jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);

      // Use mockImplementation to simulate a successful database query
      mockedPool.query.mockImplementation(() =>
        Promise.resolve({
          rows: [mockDbRow],
          rowCount: 1,
        })
      );
    });

    // afterEach runs after each test to clean up
    afterEach(() => {
      // Restore real timers
      jest.useRealTimers();
    });

    it("should successfully create a user with valid input", async () => {
      // Act: Call the method being tested
      const result = await userRepository.create(mockCreateInput);

      // Assert: Verify the expected outcome and interactions
      expect(result).toEqual(mockUser);
      expect(mockedPool.query).toHaveBeenCalled();
    });

    it("should throw an error if the email already exists", async () => {
      // Arrange: Override the default mock for this specific test
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert: Expect the create method to reject with a specific error
      await expect(userRepository.create(mockCreateInput)).rejects.toThrow(
        "Email already exists"
      );

      // Verify that the database query was not made
      expect(mockedPool.query).not.toHaveBeenCalled();
    });

    it("should throw a formatted error if the database query fails", async () => {
      // Arrange: Simulate a database error
      const dbError = new Error("Connection timeout");
      mockedPool.query.mockImplementation(() => Promise.reject(dbError));

      // Act & Assert: Check that the custom error is thrown
      await expect(userRepository.create(mockCreateInput)).rejects.toThrow(
        "Failed to create user: Connection timeout"
      );
    });
  });

  describe("findById", () => {
    let userRepository: UserRepository;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(mockDate);

      userRepository = new UserRepository(mockedPool);

      // Default successful query response
      mockedPool.query.mockImplementation(() =>
        Promise.resolve({
          rows: [mockDbRow],
          rowCount: 1,
        })
      );
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return a user when found", async () => {
      // Act: Call the method being tested
      const result = await userRepository.findById(mockId);

      // Assert: Verify correct query execution and result
      expect(mockedPool.query).toHaveBeenCalledWith(expect.any(String), [
        mockId,
      ]);
      expect(result).toEqual(mockUser);
    });

    it("should throw an error when user is not found", async () => {
      // Arrange: Simulate no rows returned
      mockedPool.query.mockImplementation(() =>
        Promise.resolve({
          rows: [],
          rowCount: 0,
        })
      );

      // Act & Assert: Verify the specific error is thrown
      await expect(userRepository.findById(mockId)).rejects.toThrow(
        `User with id ${mockId} not found`
      );
    });

    it("should throw an error when id is not provided", async () => {
      // Act & Assert: Check that input validation works
      await expect(userRepository.findById("")).rejects.toThrow(
        "User ID is required"
      );

      // The database should not be queried
      expect(mockedPool.query).not.toHaveBeenCalled();
    });

    it("should throw a formatted error when database query fails", async () => {
      // Arrange: Simulate database failure
      const dbError = new Error("Database connection error");
      mockedPool.query.mockImplementation(() => Promise.reject(dbError));

      // Act & Assert: Verify error is properly formatted
      await expect(userRepository.findById(mockId)).rejects.toThrow(
        "Failed to find user: Database connection error"
      );
    });
  });
});
