import {
  HttpMethod,
  SpectatorHttp,
  createHttpFactory,
} from '@ngneat/spectator/vitest';
import { describe, expect, it } from 'vitest';
import { RolesService } from './roles.service';

describe(RolesService.name, () => {
  let spectator: SpectatorHttp<RolesService>;

  const createService = createHttpFactory(RolesService);

  it('should be created', () => {
    spectator = createService();

    expect(spectator.service).toBeTruthy();
  });

  it('should get roles', () => {
    spectator = createService();

    const roles = ['ADMIN', 'STANDARD'];

    spectator.service.getRoles().subscribe((response) => {
      expect(response).toEqual(roles);
    });

    const request = spectator.expectOne('/api/roles', HttpMethod.GET);

    request.flush(roles);
  });
});
