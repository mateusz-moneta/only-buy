import {
  HttpMethod,
  SpectatorHttp,
  createHttpFactory,
} from '@ngneat/spectator/vitest';
import { describe, expect, it } from 'vitest';
import { UpdateActive, User } from '../../models';
import { UsersService } from './users.service';

describe(UsersService.name, () => {
  let spectator: SpectatorHttp<UsersService>;

  const createService = createHttpFactory(UsersService);

  it('should be created', () => {
    spectator = createService();

    expect(spectator.service).toBeTruthy();
  });

  it('should get users', () => {
    spectator = createService();

    const users: User[] = [
      {
        id: 'user-1',
        active: true,
        avatar: 'avatar.jpg',
        username: 'admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        createdDate: new Date(),
        updatedDate: new Date(),
      },
      {
        id: 'user-2',
        active: false,
        avatar: 'avatar2.jpg',
        username: 'user',
        email: 'user@example.com',
        role: 'STANDARD',
        createdDate: new Date(),
        updatedDate: new Date(),
      },
    ];

    const response = {
      data: users,
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1,
    };

    spectator.service.getUsers().subscribe((result) => {
      expect(result).toEqual(response);
    });

    const request = spectator.expectOne('/api/users?page=1', HttpMethod.GET);

    request.flush(response);
  });

  it('should get users with pagination', () => {
    spectator = createService();

    const users: User[] = [
      {
        id: 'user-11',
        active: true,
        avatar: null,
        username: 'user11',
        email: 'user11@example.com',
        role: 'STANDARD',
        createdDate: new Date(),
        updatedDate: new Date(),
      },
    ];

    const response = {
      data: users,
      total: 21,
      page: 2,
      limit: 10,
      totalPages: 3,
    };

    spectator.service.getUsers(2).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const request = spectator.expectOne('/api/users?page=2', HttpMethod.GET);

    request.flush(response);
  });

  it('should update user active state', () => {
    spectator = createService();

    const update: UpdateActive = {
      id: 'user-1',
      active: true,
    };

    spectator.service.updateUserActive(update).subscribe();

    const request = spectator.expectOne('/api/users/user-1', HttpMethod.PATCH);

    expect(request.request.body).toEqual({
      active: true,
    });

    request.flush({});
  });

  it('should deactivate user', () => {
    spectator = createService();

    const update: UpdateActive = {
      id: 'user-1',
      active: false,
    };

    spectator.service.updateUserActive(update).subscribe();

    const request = spectator.expectOne('/api/users/user-1', HttpMethod.PATCH);

    expect(request.request.body).toEqual({
      active: false,
    });

    request.flush({});
  });
});
