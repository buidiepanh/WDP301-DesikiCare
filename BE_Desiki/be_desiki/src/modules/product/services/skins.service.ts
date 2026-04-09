import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { SkinTypeRepository } from 'src/database/schemas/skinType/skinType.repository';
import { SkinStatusRepository } from 'src/database/schemas/skinStatus/skinStatus.repository';
import { ProductSkinTypeRepository } from 'src/database/schemas/productSkinType/productSkinType.repository';
import { ProductSkinStatusRepository } from 'src/database/schemas/productSkinStatus/productSkinStatus.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';

@Injectable()
export class SkinsService {
    constructor(
        private readonly skinTypeRepository: SkinTypeRepository,
        private readonly skinStatusRepository: SkinStatusRepository,
        private readonly productSkinTypeRepository: ProductSkinTypeRepository,
        private readonly productSkinStatusRepository: ProductSkinStatusRepository,

        @InjectConnection() private readonly connection: Connection,
        // @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }

    //----------- Exist Checks -----------
    async getExistSkinTypeById(skinTypeId: number): Promise<any> {
        const skinType = await this.skinTypeRepository.findById(skinTypeId);
        if (!skinType) {
            throw new HttpException('Skin type not found: id ' + skinTypeId, HttpStatus.NOT_FOUND);
        }
        return skinType;
    }

    async getExistSkinStatusById(skinStatusId: number): Promise<any> {
        const skinStatus = await this.skinStatusRepository.findById(skinStatusId);
        if (!skinStatus) {
            throw new HttpException('Skin status not found: id ' + skinStatusId, HttpStatus.NOT_FOUND);
        }
        return skinStatus;
    }

    //----------- Main Functions -----------
    async addSkinTypesToProduct(productId: Types.ObjectId, skinTypeIds: number[]) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            for (const skinTypeId of skinTypeIds) {
                await this.getExistSkinTypeById(skinTypeId);
            }
            const productSkinTypes = skinTypeIds.map(skinTypeId => ({
                productId: productId,
                skinTypeId: skinTypeId
            }));

            await this.productSkinTypeRepository.deleteMany({ productId: productId }, session);
            for (const productSkinType of productSkinTypes) {
                await this.productSkinTypeRepository.create(productSkinType, session);
            }
            await session.commitTransaction();
            return { message: 'Skin types added to product successfully' };
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Failed to add skin types to product', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async addSkinStatusesToProduct(productId: Types.ObjectId, skinStatusIds: number[]) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            for (const skinStatusId of skinStatusIds) {
                await this.getExistSkinStatusById(skinStatusId);
            }

            const productSkinStatuses = skinStatusIds.map(skinStatusId => ({
                productId: productId,
                skinStatusId: skinStatusId
            }));
            
            await this.productSkinStatusRepository.deleteMany({ productId: productId }, session);
            for (const productSkinStatus of productSkinStatuses) {
                await this.productSkinStatusRepository.create(productSkinStatus, session);
            }
            await session.commitTransaction();
            return { message: 'Skin statuses added to product successfully' };
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Failed to add skin statuses to product', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async getSkinTypes() {
        try {
            const skinTypes = await this.skinTypeRepository.findAll();
            return skinTypes;
        } catch (error) {
            throw new HttpException('Failed to get skin types: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getSkinStatuses() {
        try {
            const skinStatuses = await this.skinStatusRepository.findAll();
            return skinStatuses;
        } catch (error) {
            throw new HttpException('Failed to get skin statuses: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
