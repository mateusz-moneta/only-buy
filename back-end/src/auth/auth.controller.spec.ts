import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './services';
import { UsersService } from '../users/services';
import { Login, RefreshUser, RegisterUser } from '../users/models';

describe(AuthController.name, () => {
  let controller: AuthController;

  const authService = {
    login: jest.fn(),
    getUserDataFromRefreshToken: jest.fn(),
  };

  const usersService = {
    register: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login user', async () => {
      const loginUserDto = {
        username: 'john',
        password: 'TestPassword123!',
      };

      const loginResult: Login = {
        username: 'john',
        avatar: null,
        role: 'STANDARD',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      authService.login.mockResolvedValue(loginResult);

      const result = await controller.login(loginUserDto);

      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);

      expect(result).toEqual(loginResult);
    });
  });

  describe('getAccessFromRefreshToken', () => {
    it('should return user data from refresh token', async () => {
      const dto = {
        refreshToken: 'refresh-token',
      };

      const refreshUser: RefreshUser = {
        username: 'john',
        avatar: null,
        role: 'STANDARD',
        accessToken: 'new-access-token',
      };

      authService.getUserDataFromRefreshToken.mockResolvedValue(refreshUser);

      const result = await controller.getAccessFromRefreshToken(dto);

      expect(authService.getUserDataFromRefreshToken).toHaveBeenCalledTimes(1);

      expect(authService.getUserDataFromRefreshToken).toHaveBeenCalledWith(
        'refresh-token',
      );

      expect(result).toEqual(refreshUser);
    });
  });

  describe('create', () => {
    it('should register user without avatar', async () => {
      const registerUserDto = {
        username: 'john',
        email: 'john@example.com',
        password: 'TestPassword123!',
      };

      const registerResult: RegisterUser = {
        username: 'john',
        email: 'john@example.com',
      };

      usersService.register.mockResolvedValue(registerResult);

      const result = await controller.create(registerUserDto);

      expect(usersService.register).toHaveBeenCalledTimes(1);
      expect(usersService.register).toHaveBeenCalledWith(
        registerUserDto,
        undefined,
      );

      expect(result).toEqual(registerResult);
    });

    it('should register user with avatar', async () => {
      const registerUserDto = {
        username: 'john',
        email: 'john@example.com',
        password: 'TestPassword123!',
      };

      const avatar = {
        fieldname: 'avatar',
        originalname: 'avatar.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024,
        destination: '',
        filename: 'avatar.png',
        path: '',
        buffer: Buffer.from('image'),
      } as Express.Multer.File;

      const registerResult: RegisterUser = {
        username: 'john',
        email: 'john@example.com',
      };

      usersService.register.mockResolvedValue(registerResult);

      const result = await controller.create(registerUserDto, avatar);

      expect(usersService.register).toHaveBeenCalledTimes(1);
      expect(usersService.register).toHaveBeenCalledWith(
        registerUserDto,
        avatar,
      );

      expect(result).toEqual(registerResult);
    });
  });
});
