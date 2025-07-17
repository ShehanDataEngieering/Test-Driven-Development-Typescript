import { UserRepository } from "../../../src/repositories/UserRepository";
import { CreateUserInput, User } from "../../../src/types/User";
import { pool } from "../../../src/database/connection";
jest.mock("../../../src/database/connection", () => {
  return {
    pool: {
      query: jest.fn(),
    },
  };
});

const mockedPool = pool as jest.Mocked<typeof pool>;

describe("UserRepository", () => {
  describe("create", () => {
    let userRepository: UserRepository;

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

    // beforeEach runs before each test in this block
    beforeEach(() => {
      // Reset all mocks to ensure test isolation
      jest.clearAllMocks();
      // Use fake timers to control Date() constructor
      jest.useFakeTimers().setSystemTime(mockDate);

      // Create a new instance of the repository for each test
      userRepository = new UserRepository(mockedPool);

      // Mock/spy on methods of the repository instance
      jest.spyOn(userRepository, "validateCreateInput").mockImplementation();
      jest.spyOn(userRepository, "generateId").mockReturnValue(mockId);
      jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
      jest.spyOn(userRepository, "mapRowToUser").mockImplementation((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));

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
      expect(userRepository.validateCreateInput).toHaveBeenCalledWith(
        mockCreateInput
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        mockCreateInput.email
      );
      expect(userRepository.generateId).toHaveBeenCalled();
      expect(mockedPool.query).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockId,
        name: mockCreateInput.name,
        email: mockCreateInput.email,
        createdAt: mockDate,
        updatedAt: mockDate,
      });
    });

    it("should throw an error if the email already exists", async () => {
      // Arrange: Override the default mock for this specific test
      (userRepository as any).findByEmail.mockResolvedValue(mockDbRow);

      // Act & Assert: Expect the create method to reject with a specific error
      await expect(userRepository.create(mockCreateInput)).rejects.toThrow(
        "Email already exists"
      );

      // Verify that the database query was not made
      expect(mockedPool.query).not.toHaveBeenCalled();
    });
  });
});
