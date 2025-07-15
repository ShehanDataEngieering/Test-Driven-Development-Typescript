import { UserRepository } from '../../../src/repositories/UserRepository';
import { CreateUserInput, UpdateUserInput } from '../../../src/types/User';
import { UserTestData } from '../../fixtures/UserTestData';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  describe('create', () => {
    it('should create a new user with valid input', async () => {
      const input = UserTestData.createValidUserInput();

      const user = await userRepository.create(input);

      expect(user).toMatchObject({
        name: input.name,
        email: input.email
      });
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate unique IDs for different users', async () => {
      const input1 = UserTestData.createValidUserInputWithCustomData({ 
        name: 'User 1', 
        email: 'user1@example.com' 
      });
      const input2 = UserTestData.createValidUserInputWithCustomData({ 
        name: 'User 2', 
        email: 'user2@example.com' 
      });

      const user1 = await userRepository.create(input1);
      const user2 = await userRepository.create(input2);

      expect(user1.id).not.toBe(user2.id);
    });

    it('should throw error when name is empty', async () => {
      const input = UserTestData.createInvalidUserInputs().emptyName;

      await expect(userRepository.create(input)).rejects.toThrow('Name cannot be empty');
    });

    it('should throw error when email is empty', async () => {
      const input = UserTestData.createInvalidUserInputs().emptyEmail;

      await expect(userRepository.create(input)).rejects.toThrow('Email cannot be empty');
    });

    it('should throw error when email format is invalid', async () => {
      const input = UserTestData.createInvalidUserInputs().invalidEmail;

      await expect(userRepository.create(input)).rejects.toThrow('Invalid email format');
    });
  });

 
});
