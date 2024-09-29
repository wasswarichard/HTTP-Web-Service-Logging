import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    try {
      return roles.includes(request.user.role);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
