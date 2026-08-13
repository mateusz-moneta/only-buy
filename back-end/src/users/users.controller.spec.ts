import { UsersController } from './users.controller';
import { UsersService } from './services';
import { User } from './models';

describe(UsersController.name, () => {
  let controller: UsersController;

  const usersService = {
    findAll: jest.fn(),
    updateActive: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new UsersController(usersService as unknown as UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 'user-1',
          username: 'john',
          email: 'john@example.com',
          active: true,
        },
        {
          id: 'user-2',
          username: 'jane',
          email: 'jane@example.com',
          active: false,
        },
      ] as User[];

      usersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalledTimes(1);
      expect(usersService.findAll).toHaveBeenCalledWith();

      expect(result).toBe(users);
    });

    it('should return empty array when there are no users', async () => {
      usersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update user active state', async () => {
      const id = 'user-id';

      const updateActiveStateDto = {
        active: true,
      };

      const user = {
        id,
        username: 'john',
        email: 'john@example.com',
        active: true,
      } as User;

      usersService.updateActive.mockResolvedValue(user);

      const result = await controller.update(id, updateActiveStateDto);

      expect(usersService.updateActive).toHaveBeenCalledTimes(1);

      expect(usersService.updateActive).toHaveBeenCalledWith(id, true);

      expect(result).toBe(user);
    });

    it('should deactivate user', async () => {
      const id = 'user-id';

      const updateActiveStateDto = {
        active: false,
      };

      const user = {
        id,
        username: 'john',
        email: 'john@example.com',
        active: false,
      } as User;

      usersService.updateActive.mockResolvedValue(user);

      const result = await controller.update(id, updateActiveStateDto);

      expect(usersService.updateActive).toHaveBeenCalledWith(id, false);

      expect(result).toBe(user);
    });
  });
});
