import { SetMetadata } from '@nestjs/common';

export const DYNAMIC_ROLES_KEY = 'dynamicRoles';
export const DynamicRoles = (module: string, action: string) =>
  SetMetadata(DYNAMIC_ROLES_KEY, { module, action });
