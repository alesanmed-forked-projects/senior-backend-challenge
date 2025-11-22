import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';
import { AuthUser } from 'src/auth/domain/auth-user';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();

    return requiredRoles.some((role) =>
      user?.role.equals(UserRole.fromRole(role)),
    );
  }
}
