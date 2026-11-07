import { Repository } from 'typeorm';

import { RoleEntity } from '../../entities';
import { RolesService } from './roles.service';

describe(RolesService.name, () => {
  let service: RolesService;

  const rolesRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new RolesService(
      rolesRepository as unknown as Repository<RoleEntity>,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
          name: 'USER',
        },
      ] as unknown as RoleEntity[];

      rolesRepository.find.mockResolvedValue(roles);

      const result = await service.findAll();

      expect(rolesRepository.find).toHaveBeenCalledTimes(1);
      expect(rolesRepository.find).toHaveBeenCalledWith();

      expect(result).toBe(roles);
    });

    it('should return empty array when no roles exist', async () => {
      rolesRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(rolesRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('findOneByName', () => {
    it('should return role by name', async () => {
      const role = {
        id: 'role-1',
        name: 'ADMIN',
      } as unknown as RoleEntity;

      rolesRepository.findOneBy.mockResolvedValue(role);

      const result = await service.findOneByName('ADMIN');

      expect(rolesRepository.findOneBy).toHaveBeenCalledTimes(1);

      expect(rolesRepository.findOneBy).toHaveBeenCalledWith({
        name: 'ADMIN',
      });

      expect(result).toBe(role);
    });

    it('should return null when role does not exist', async () => {
      rolesRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOneByName('UNKNOWN');

      expect(rolesRepository.findOneBy).toHaveBeenCalledTimes(1);

      expect(rolesRepository.findOneBy).toHaveBeenCalledWith({
        name: 'UNKNOWN',
      });

      expect(result).toBeNull();
    });
  });
});
