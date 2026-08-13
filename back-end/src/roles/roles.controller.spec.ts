import { RoleEntity } from './entities';
import { RolesController } from './roles.controller';
import { RolesService } from './services';

describe(RolesController.name, () => {
  let controller: RolesController;

  const rolesService = {
    findAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new RolesController(rolesService as unknown as RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const roles = [
        {
          id: 'role-1',
          name: 'ADMIN',
        },
        {
          id: 'role-2',
          name: 'STANDARD',
        },
      ] as unknown as RoleEntity[];

      rolesService.findAll.mockResolvedValue(roles);

      const result = await controller.findAll();

      expect(rolesService.findAll).toHaveBeenCalledTimes(1);
      expect(rolesService.findAll).toHaveBeenCalledWith();

      expect(result).toBe(roles);
    });

    it('should return empty array when there are no roles', async () => {
      rolesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(rolesService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
