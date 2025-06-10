import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/database/schemas/account/account.repository';
import { RoleRepository } from 'src/database/schemas/role/role.repository';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountModel } from 'src/database/schemas/account/account.schema';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { DeliveryAddressRepository } from 'src/database/schemas/deliveryAddress/deliveryAddress.repository';

@Injectable()
export class AccountsService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly roleRepository: RoleRepository,
        private readonly deliveryAddressRepository: DeliveryAddressRepository,

        @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }

    async getExistAccountById(accountId: Types.ObjectId): Promise<any> {
        const account = await this.accountRepository.findById(accountId);

        if (!account) {
            throw new HttpException('Account not found', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return account;
    }

    async getValidatedAccountById(accountId: Types.ObjectId): Promise<any> {
        const account = await this.accountRepository.findById(accountId);

        if (!account || account.isDeactivated) {
            throw new HttpException('Account not found', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return account;
    }

    //////////////////////////////////////////////


    async login(email: string, password: string): Promise<string> {
        const account = await this.accountModel.findOne({ email: email });
        if (!account) {
            throw new HttpException('Invalid email or password', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            throw new HttpException('Invalid email or password', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const jwt_payload = {
            _id: account._id,
            email: account.email,
            fullName: account.fullName,
            phoneNumber: account.phoneNumber,
            role: await this.roleRepository.findById(account.roleId),
        }
        const token: string = this.jwtService.generateJWT_TwoPublicPrivateKey(jwt_payload, '1d');
        return token;
    }

    async addAccount(account: Account, imageBase64: string): Promise<any> {
        const emailIsExist = await this.accountModel.findOne({ $and: [{ email: account.email }, { email: { $ne: null } }] });
        if (emailIsExist) {
            throw new HttpException('Email already existed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        var adding_accountId: Types.ObjectId = null
        try {
            const hash_password = await this.bcryptService.hashPassword(account.password);
            const addedAccount = await this.accountRepository.create({
                password: hash_password,
                roleId: account.roleId,
                email: account.email,
                phoneNumber: account.phoneNumber,
                fullName: account.fullName,
                isDeactivated: account.isDeactivated || false,
                dob: account.dob || null,
                gender: account.gender || null,
                points: account.points || 0,
            })

            const folderPath = this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH') + `/${addedAccount._id}`;
            await this.fileService.createFolder(folderPath);

            if (imageBase64) {
                await this.fileService.saveBase64File(imageBase64, folderPath, "main");
            } else {
                const sourcePath = this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH');
                const destinationPath = folderPath;
                const sourceFileName = 'unknown.jpg';
                const destinationFileName = 'main.jpg';
                await this.fileService.copyFile(sourcePath, sourceFileName, destinationPath, destinationFileName);
            }
            adding_accountId = addedAccount._id
            return addedAccount;
        } catch (error) {
            console.log(error);
            await this.fileService.deleteFolder(this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH') + `/${adding_accountId}`);
            throw new HttpException('Add account failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getAllStaff(): Promise<any> {
        try {
            const accounts = await this.accountRepository.findByRoleIds([2, 3]);
            
            return await Promise.all( accounts.map(async account => {
                return {
                    ...account,
                    imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH'), account._id, "main")
                }
            }));
        } catch (error) {
            console.log(error);
            throw new HttpException('Get all staff failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAllCustomer(): Promise<any> {
        try {
            const accounts = await this.accountRepository.findByRoleId(1);
            return await Promise.all( accounts.map(async account => {
                return {
                    ...account,
                    imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH'), account._id, "main")
                }
            }));
        } catch (error) {
            console.log(error);
            throw new HttpException('Get all customer failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAccountDetail(accountId: Types.ObjectId): Promise<any> {
        try {
            const account = await this.accountRepository.findById(accountId);
            return {
                ...account,
                imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH'), account._id, "main")
            }
        } catch (error) {
            console.log(error);
            throw new HttpException('Get account detail failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateAccount(accountId: Types.ObjectId, account: Account, imageBase64: string): Promise<any> {
        await this.getExistAccountById(accountId);

        try {
            account = { ...account, password: await this.bcryptService.hashPassword(account.password) };
            const updatedAccount = await this.accountRepository.update(accountId, account);
            const folderPath = this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH') + `/${accountId}`;
            if (imageBase64) {
                await this.fileService.deleteFile(folderPath, "main");
                await this.fileService.saveBase64File(imageBase64, folderPath, "main");
            }
            return updatedAccount;
        } catch (error) {
            console.log(error);

            throw new HttpException('Update account failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteAccount(accountId: Types.ObjectId): Promise<any> {
        await this.getExistAccountById(accountId);
        try {
            await this.accountRepository.delete(accountId);
            await this.fileService.deleteFolder(this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH') + `/${accountId}`);
        } catch (error) {
            console.log(error);
            throw new HttpException('Delete account failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    async undeleteAllAccount(): Promise<any> {
        try {
            await this.accountModel.updateMany({}, { isDeleted: false });
        } catch (error) {
            console.log(error);
            throw new HttpException('Opps!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





}
