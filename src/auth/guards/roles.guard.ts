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
    const role = this.reflector.get('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    try {
      // console.log(role);
      // console.log(request.user);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
