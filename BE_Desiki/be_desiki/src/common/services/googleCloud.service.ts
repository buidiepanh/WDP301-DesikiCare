import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { Types } from 'mongoose';
import { join } from 'path';
import { promises as fs } from 'fs';
import { ConfigService } from '@nestjs/config';
import { BcryptConfig } from 'src/config/bcrypt.config';
import { FileService } from 'src/common/services/file.service';
import axios from 'axios';
import { JwtConfig } from 'src/config/jwt.config';

@Injectable()
export class GoogleCloudService {
    public  GoogleCloudConfig : any;
    constructor(

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
        

    ) {
        this.GoogleCloudConfig = this.configService.get('googleCloudConfig');
    }


    // hàm mã hoá access token để lấy thông tin user
    async getUserFromAccessToken(accessToken: string): Promise<any> {
        try {
            const response = await axios.post(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`            );
            
            return response.data; // Axios tự động parse JSON
        } catch (error) {
            console.error('Error encrypting access token:', error.response?.data || error.message);
            throw new Error('Failed to encrypt access token');
        }
    }

    
    async exchangeAccessTokenByAuthorizationCode( exchangeData : {authorizationCode: string,redirectUri: string} ): Promise<any> {
        try {
         
            const response = await axios.post('https://oauth2.googleapis.com/token', null, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                params: {
                    client_id: this.GoogleCloudConfig.CLIENT_ID,
                    client_secret: this.GoogleCloudConfig.CLIENT_SECRET,
                    // redirect_uri: this.GoogleCloudConfig.REDIRECT_URI,
                    redirect_uri: exchangeData.redirectUri,
                    grant_type: this.GoogleCloudConfig.GRANT_TYPE,
                    code: exchangeData.authorizationCode,
                },
            });
            return response.data; // Axios tự động parse JSON
        } catch (error) {
            console.error('Error exchanging auth code for access token:', error.response?.data || error.message);
            throw new Error('Failed to exchange auth code for access token');
        }
    }

}
