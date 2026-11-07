import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';

import { RolesService } from '../services';
import { RoleEntity } from '../entities';

describe('Roles integration', () => {
  let module: TestingModule;
  let rolesService: RolesService;
  let rolesRepository: Repository<RoleEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([RoleEntity]),
      ],
      providers: [RolesService],
    }).compile();

    rolesService = module.get(RolesService);

    rolesRepository = module.get(getRepositoryToken(RoleEntity));
  }, 30000);

  afterAll(async () => {
    await module.close();
  }, 30000);

  describe('findAll', () => {
    it('should return roles from database', async () => {
      const role = await rolesRepository.save(
        rolesRepository.create({
          name: `INTEGRATION_${Date.now()}`,
        }),
      );

      const result = await rolesService.findAll();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: role.id,
            name: role.name,
          }),
        ]),
      );
    });
  });

  describe('findOneByName', () => {
    it('should return role by name', async () => {
      const roleName = `INTEGRATION_${Date.now()}`;

      const role = await rolesRepository.save(
        rolesRepository.create({
          name: roleName,
        }),
      );

      const result = await rolesService.findOneByName(roleName);

      expect(result).toBeDefined();
      expect(result?.id).toBe(role.id);
      expect(result?.name).toBe(roleName);
    });

    it('should return null when role does not exist', async () => {
      const result = await rolesService.findOneByName(
        'ROLE_THAT_DOES_NOT_EXIST',
      );

      expect(result).toBeNull();
    });
  });
});
