import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtConfig } from 'src/config/jwt.config';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class JwtService {
    constructor() { }

    

    generateJWT_OneSecretKey(payload: object, expiresIn: string | number): string {
        try {
            const token = jwt.sign(payload, JwtConfig.SECRET_KEY, { expiresIn });
            return token;
        } catch (error) {
            console.error('Error generating JWT:', error);
            throw new Error('Could not generate JWT');
        }
    };

    generateJWT_TwoPublicPrivateKey(payload: object, expiresIn: string | number): string {
        try {
            const privateKey = fs.readFileSync(join(process.cwd(), JwtConfig.PRIVATE_KEY_PATH)).toString();

            const token = jwt.sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn,
            });
            return token;
        } catch (error) {
            console.error('Error generating JWT:', error);
            throw new Error('Could not generate JWT');
        }
    }

    extractAuthorizationHeaderToken(request: any): string {
        const authorizationHeader = request.headers['authorization'];
        if (!authorizationHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }
        if (!authorizationHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid authorization header format');
        }
        return authorizationHeader.replace('Bearer ', '');
    }

    decodeToken_OneSecretKey(token: string): any {
        try {
            const decoded = jwt.verify(token, JwtConfig.SECRET_KEY);
            return decoded;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    decodeToken_TwoPublicPrivateKey(token: string): any {
        try {
            const publicKey = fs.readFileSync(join(process.cwd(), JwtConfig.PUBLIC_KEY_PATH)).toString();
            const decoded = jwt.verify(token, publicKey, {
                algorithms: ['RS256'],
            });
            return decoded;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }


}
