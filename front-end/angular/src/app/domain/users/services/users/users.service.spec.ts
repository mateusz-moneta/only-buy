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

    spectator.service.getUsers().subscribe((response) => {
      expect(response).toEqual(users);
    });

    const request = spectator.expectOne('/api/users', HttpMethod.GET);

    request.flush(users);
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
