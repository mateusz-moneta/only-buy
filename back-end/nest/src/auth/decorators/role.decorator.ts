import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/models';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const Admin = () => Roles('ADMIN' as Role);

export const Standard = () => Roles('STANDARD' as Role);
