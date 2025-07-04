import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/database/schemas/account/account.repository';
import { RoleRepository } from 'src/database/schemas/role/role.repository';
import * as bcrypt from 'bcrypt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Account, AccountModel } from 'src/database/schemas/account/account.schema';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { Connection, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { DeliveryAddressRepository } from 'src/database/schemas/deliveryAddress/deliveryAddress.repository';
import { DeliveryAddress } from 'src/database/schemas/deliveryAddress/deliveryAddress.schema';

@Injectable()
export class AccountsService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly roleRepository: RoleRepository,
        private readonly deliveryAddressRepository: DeliveryAddressRepository,

        @InjectConnection() private readonly connection: Connection,
        @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }

    //----------- Exist Checks -----------
    async getExistAccountById(accountId: Types.ObjectId): Promise<any> {
        const account = await this.accountRepository.findById(accountId);

        if (!account) {
            throw new HttpException('Account not found: id ' + accountId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return account;
    }

    async getValidatedAccountById(accountId: Types.ObjectId): Promise<any> {
        const account = await this.accountRepository.findById(accountId);

        if (!account || account.isDeactivated) {
            throw new HttpException('Account not found id ' + accountId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return account;
    }

    async getExistRoleById(roleId: number): Promise<any> {
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
            throw new HttpException('Role not found: id ' + roleId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return role;
    }

    async getExistDeliveryAddressById(deliveryAddressId: Types.ObjectId): Promise<any> {
        const deliveryAddress = await this.deliveryAddressRepository.findById(deliveryAddressId);
        if (!deliveryAddress) {
            throw new HttpException('Delivery address not found: id ' + deliveryAddressId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return deliveryAddress;
    }

    async getExistDeliveryAddressesByAccountId(accountId: Types.ObjectId): Promise<any> {
        const deliveryAddresses = await this.deliveryAddressRepository.findByAccountId(new Types.ObjectId(accountId));
        if (!deliveryAddresses || deliveryAddresses.length === 0) {
            throw new HttpException('Delivery address not found for this account id ' + accountId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return deliveryAddresses;
    }


    //------------ Main functions -----------

    async login(email: string, password: string): Promise<string> {
        const account = await this.accountModel.findOne({ email: email });
        if (!account) {
            throw new HttpException('Invalid email or password', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        console.log('oldPassword: ', password);
        console.log('account.password: ', account.password);
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            throw new HttpException('Invalid email or password', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const jwt_payload = {
            _id: account._id,
            role: await this.roleRepository.findById(account.roleId),
        }
        const token: string = this.jwtService.generateJWT_TwoPublicPrivateKey(jwt_payload, '1d');
        return token;
    }

    async addAccount(account: Account & { imageBase64: string }): Promise<any> {
        var adding_accountId: Types.ObjectId = null
        try {
            await this.getExistRoleById(account.roleId);
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

            if (account.imageBase64) {
                await this.fileService.saveBase64File(account.imageBase64, folderPath, "main");
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
            throw new HttpException('Add account failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    async getAccountDetail(accountId: Types.ObjectId): Promise<any> {

        try {
            await this.getExistAccountById(accountId);

            const account = await this.accountRepository.findById(accountId);
            const { password, ...accountWithoutPassword } = account; // Exclude password from the response

            const deliveryAddresses = await this.deliveryAddressRepository.findByAccountId(accountId);
            return {
                account: {
                    ...accountWithoutPassword,
                    imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH'), account._id, "main"),
                },
                deliveryAddresses
            }
        } catch (error) {
            console.log(error);
            throw new HttpException('Get account detail failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateAccount(accountId: Types.ObjectId, account: Account & { imageBase64: string }): Promise<any> {

        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            var existAccount = await this.getExistAccountById(accountId);
            await this.getExistRoleById(account.roleId);
            account = { ...account, password: existAccount.password }; // Keep the existing password
            const updatedAccount = await this.accountRepository.update(accountId, account, session);
            const folderPath = this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH') + `/${accountId}`;
            if (account.imageBase64) {
                await this.fileService.deleteFile(folderPath, "main");
                await this.fileService.saveBase64File(account.imageBase64, folderPath, "main");
            }
            await session.commitTransaction();
            return updatedAccount;
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            throw new HttpException('Update account failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async updateAccountPassword(accountId: Types.ObjectId, oldPassword: string, newPassword: string): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const account = await this.getExistAccountById(accountId);

            console.log('oldPassword: ', oldPassword);
            console.log('account.password: ', account.password);
            const isMatch = await bcrypt.compare(oldPassword, account.password);

            if (!isMatch) {
                throw new HttpException('Old password is incorrect', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const hash_new_password = await this.bcryptService.hashPassword(newPassword);
            const updatedAccount = await this.accountRepository.update(accountId, { ...account, password: hash_new_password }, session);
            await session.commitTransaction();
            return updatedAccount;
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            throw new HttpException('Update account password failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async deactivateAccount(accountId: Types.ObjectId, isDeactivate: boolean): Promise<any> {

        try {
            await this.getExistAccountById(accountId);
            await this.accountRepository.deactivate(accountId, isDeactivate);
        } catch (error) {
            console.log(error);
            throw new HttpException('Deactivate account failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAccounts(roleId: number, page: number, limit: number): Promise<any> {
        try {
            const accounts = await this.accountRepository.findAll();
            console.log(accounts.length);
            return await Promise.all(accounts.map(async (account) => {
                return {
                    ...account,
                    imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH'), account._id, "main"),
                }
            }));
        } catch (error) {
            console.log(error);
            throw new HttpException('Get accounts failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    async getRoles(): Promise<any> {
        try {
            const roles = await this.roleRepository.findAll();
            return roles;
        } catch (error) {
            console.log(error);
            throw new HttpException('Get roles failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getDeliveryAddresses(accountId: Types.ObjectId): Promise<any> {
        try {
            await this.getExistAccountById(accountId);

            const deliveryAddresses = await this.deliveryAddressRepository.findByAccountId(accountId);
            return deliveryAddresses.map((address) => ({ deliveryAddress: address }));
        } catch (error) {
            console.log(error);
            throw new HttpException('Get delivery addresses failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addDeliveryAddress(accountId: Types.ObjectId, deliveryAddress: DeliveryAddress): Promise<any> {
        try {
            await this.getExistAccountById(accountId);

            deliveryAddress.accountId = accountId;
            const addedDeliveryAddress = await this.deliveryAddressRepository.create(deliveryAddress);
            if (addedDeliveryAddress.isDefault == true) {
                // Set all other addresses to not default
                await this.deliveryAddressRepository.updateMany(
                    { accountId: accountId, _id: { $ne: addedDeliveryAddress._id } },
                    { isDefault: false }
                );
            }
            return addedDeliveryAddress;
        } catch (error) {
            console.log(error);
            throw new HttpException('Add delivery address failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async setDefaultDeliveryAddress(deliveryAddressId: Types.ObjectId, accountId: Types.ObjectId): Promise<any> {

        try {
            await this.getExistAccountById(accountId);
            await this.getExistDeliveryAddressById(deliveryAddressId);
            const updatedAddress = await this.deliveryAddressRepository.setDefaultDeliveryAddress(accountId, deliveryAddressId);
            return updatedAddress;
        } catch (error) {
            console.log(error);
            throw new HttpException('Set default delivery address failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteDeliveryAddress(deliveryAddressId: Types.ObjectId, accountId: Types.ObjectId): Promise<any> {

        try {
            await this.getExistAccountById(accountId);
            await this.getExistDeliveryAddressById(deliveryAddressId);

            const deletedAddress = await this.deliveryAddressRepository.delete(deliveryAddressId);
            return deletedAddress;
        } catch (error) {
            console.log(error);
            throw new HttpException('Delete delivery address failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
