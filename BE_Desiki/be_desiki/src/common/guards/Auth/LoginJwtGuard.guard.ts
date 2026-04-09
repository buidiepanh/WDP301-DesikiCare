import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import e from 'express';
import { Types } from 'mongoose';
import { AccountRepository } from 'src/database/schemas/account/account.repository';

@Injectable()
export class LoginJwtGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly accountRepository: AccountRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { user } = request;
        if (!user || !user._id) {
            throw new UnauthorizedException();
        }
        const account = await this.accountRepository.findById(new Types.ObjectId(user._id));
        if (!account) {
            throw new UnauthorizedException();
        }
        return true;

    }
}
