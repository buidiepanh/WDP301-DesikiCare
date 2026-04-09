import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { GameEventRepository } from 'src/database/schemas/gameEvent/gameEvent.repository';
import { GameTypeRepository } from 'src/database/schemas/gameType/gameType.repository';
import { GameEventRewardResultRepository } from 'src/database/schemas/gameEventRewardResult/gameEventRewardResult.repository';
import { ChatbotConfigRepository } from 'src/database/schemas/chatbotConfig/chatbotConfig.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { AccountsService } from 'src/modules/account/services/accounts.service';

@Injectable()
export class ChatbotService {
    constructor(
        private readonly chatbotConfigRepository: ChatbotConfigRepository,

        private readonly accountsService: AccountsService, 

        @InjectConnection() private readonly connection: Connection,
        // @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }

    //----------- Exist Checks -----------
    async getExistChatbotConfigById(chatbotConfigId: Types.ObjectId): Promise<any> {
        const chatbotConfig = await this.chatbotConfigRepository.findById(chatbotConfigId);
        if (!chatbotConfig) {
            throw new HttpException('Chatbot config not found: id ' + chatbotConfigId, HttpStatus.NOT_FOUND);
        }
        return chatbotConfig;
    }
    //----------- Main Functions -----------
    async getChatbotConfigs() {
        try {
            const chatbotConfigs = await this.chatbotConfigRepository.findAll();
            return chatbotConfigs;
        } catch (error) {
            throw new HttpException('Get chatbot configs failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async createChatbotConfig(creatorAccountId: Types.ObjectId, chatbotConfig: { template: string; initPrompt: string }) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const newConfig = await this.chatbotConfigRepository.create({
                createdBy: new Types.ObjectId(creatorAccountId),
                ...chatbotConfig
            }, session);
            await session.commitTransaction();
            return newConfig;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Create chatbot config failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }

    }

    async updateChatbotConfig(chatbotConfigId : Types.ObjectId, chatbotConfig: { template: string; initPrompt: string }) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const existChatBotConfig = await this.getExistChatbotConfigById(chatbotConfigId);
            const updatedConfig = await this.chatbotConfigRepository.update(chatbotConfigId, {
                ...chatbotConfig,
                createdBy: existChatBotConfig.createdBy,
            }, session);
            await session.commitTransaction();
            return updatedConfig;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Update chatbot config failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async deactivateChatbotConfig(chatbotConfigId: Types.ObjectId, isDeactivated: boolean) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistChatbotConfigById(chatbotConfigId);
            const updatedConfig = await this.chatbotConfigRepository.deactivate(chatbotConfigId, isDeactivated, session);
            await session.commitTransaction();
            return updatedConfig;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Deactivate chatbot config failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

}
