import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DYNAMIC_ROLES_KEY } from '../decorators/dynamic-roles.decorator';
import { RolesService } from '../roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<{ module: string; action: string }>(
      DYNAMIC_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const { module, action } = requiredPermission;

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied: User not authenticated');
    }

    const rolesWithPermission = await this.rolesService.getRolesWithPermission(module, action);

    const hasRole = user.roles.some((role) => rolesWithPermission.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    return true;
  }
}
