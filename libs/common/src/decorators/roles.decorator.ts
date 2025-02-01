import { SetMetadata } from '@nestjs/common';

enum Role {
  MANAGER,
  ADMIN,
}
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
