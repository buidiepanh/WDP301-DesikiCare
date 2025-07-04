import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Types } from 'mongoose';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';
import { AccountRepository } from 'src/database/schemas/account/account.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly accountRepository: AccountRepository

  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user._id) {
      return false;
    }
    const account = await this.accountRepository.findById(new Types.ObjectId(user._id));
    if (!account) {
      throw new UnauthorizedException();
    }
    return requiredRoles.some((role) => user.role.name == role);
  }
}

