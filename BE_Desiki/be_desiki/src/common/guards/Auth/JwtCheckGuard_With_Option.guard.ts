
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Type, mixin } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { join } from 'path';
import { JwtConfig } from 'src/config/jwt.config';
import { Reflector } from '@nestjs/core';
import { JwtService } from 'src/common/services/jwt.service';
import e from 'express';

export function JwtCheckGuard_With_Option(
  option: "secret" | "public_private",
): Type<CanActivate> {
  @Injectable()
  class Guard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
      private readonly jwtService: JwtService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();

      const authorizationHeader = request.headers['authorization'];
      var token = authorizationHeader ? authorizationHeader.replace('Bearer ', '') : null;


      if (token) {
        if (option === 'secret') {
          request.user = this.jwtService.decodeToken_OneSecretKey(token);
          return true;
        } else if (option === 'public_private') {
          request.user = this.jwtService.decodeToken_TwoPublicPrivateKey(token);
          return true;
        } 
      }

      request.user = null;
      return true;

    }
  }
  return mixin(Guard);

}

