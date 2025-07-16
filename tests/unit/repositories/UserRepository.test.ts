import { UserRepository } from "../../../src/repositories/UserRepository";
import { CreateUserInput } from "../../../src/types/User";
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
      name: 'Test User',
      email: 'test@example.com',
      created_at: mockDate.toISOString(), 
      updated_at: mockDate.toISOString(),
    };


beforeEach(() => {
  userRepository = new UserRepository();
  mockedPool.query.mockReset();
});

  });
});
