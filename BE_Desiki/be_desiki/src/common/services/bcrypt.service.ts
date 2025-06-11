import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BcryptConfig } from 'src/config/bcrypt.config';

@Injectable()
export class BcryptService {
    constructor() { }

    async hashPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(BcryptConfig.SALT_ROUNDS);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            console.error('Error hashing password:', error.message);
            throw new Error('Could not hash password');
        }
    }

}
