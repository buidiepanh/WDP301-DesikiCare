import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import e from 'express';

@Injectable()
export class LoginJwtGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { user } = request;
        if (!user) {
            throw new UnauthorizedException();
        }
        return true;

    }
}
