import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { User } from 'src/users/user.entity';
import { Reflector } from '@nestjs/core';

const getField = type => {
  switch (type) {
    case 'vehicles':
      return 'owner';
    case 'events':
      return 'organiser';
    default:
      return null;
  }
};

const matchRoleOrOwner = (type: string, user, roles = null) => {
  const field = getField(type);

  return true;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request: Request = context.switchToHttp().getRequest();
    // console.log(request.path.split('/')[2]);
    const type = request.path.split('/')[2];
    const user = request.user;
    return matchRoleOrOwner(type, user, roles);
  }
}
