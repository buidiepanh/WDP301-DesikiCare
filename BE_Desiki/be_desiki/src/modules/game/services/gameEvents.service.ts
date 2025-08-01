import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { GameEventRepository } from 'src/database/schemas/gameEvent/gameEvent.repository';
import { GameTypeRepository } from 'src/database/schemas/gameType/gameType.repository';
import { GameEventRewardResultRepository } from 'src/database/schemas/gameEventRewardResult/gameEventRewardResult.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import e from 'express';
import { AccountsService } from 'src/modules/account/services/accounts.service';
import { exit } from 'process';
import { AccountRepository } from 'src/database/schemas/account/account.repository';

@Injectable()
export class GameEventsService {
    constructor(
        private readonly gameEventRepository: GameEventRepository,
        private readonly gameTypeRepository: GameTypeRepository,
        private readonly gameEventRewardResultRepository: GameEventRewardResultRepository,
        private readonly accountRepository: AccountRepository,

        private readonly accountsService: AccountsService,

        @InjectConnection() private readonly connection: Connection,
        // @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }

    //----------- Exist Checks -----------
    async getExistGameTypeById(gameTypeId: number): Promise<any> {
        const gameType = await this.gameTypeRepository.findById(gameTypeId);
        if (!gameType) {
            throw new HttpException('Game type not found: id ' + gameTypeId, HttpStatus.NOT_FOUND);
        }
        return gameType;
    }
    async getExistGameEventById(gameEventId: Types.ObjectId): Promise<any> {
        const gameEvent = await this.gameEventRepository.findById(gameEventId);
        if (!gameEvent) {
            throw new HttpException('Game event not found: id ' + gameEventId, HttpStatus.NOT_FOUND);
        }
        return gameEvent;
    }
    //----------- Main Functions -----------
    async getGameEvents(): Promise<any> {
        try {
            const gameEvents = await this.gameEventRepository.findAll();
            const result = []
            for (const event of gameEvents) {
                const {gameEventRewardResults, ...eventBase} = event;
                const gameTypeImageUrls = []
                var isEnough = false;
                var gameTypeImageIndex = 1;
                while (isEnough === false) {
                    const gameTypeImageUrl: string = await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.GAMEEVENT_IMAGE_PATH'), eventBase._id + "/gameTypes", String(gameTypeImageIndex))
                    if (gameTypeImageUrl.includes("/unknown.jpg")) {
                        isEnough = true;
                    } else {
                        gameTypeImageUrls.push({
                            id: gameTypeImageIndex,
                            imageUrl: gameTypeImageUrl,
                        });
                    }
                    gameTypeImageIndex++;

                }
                result.push({
                    gameEvent: {
                        ...eventBase,
                        imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.GAMEEVENT_IMAGE_PATH'), event._id, "main"),
                    },
                    gameTypeImageUrls: gameTypeImageUrls,
                    gameEventRewardResults: gameEventRewardResults

                });
            }
            
            return result

        } catch (error) {
            throw new HttpException('Get game events failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async createGameEvent(gameEventData: {
        gameEvent: {
            eventName: string;
            description: string;
            gameName: string;
            gameTypeId: number;
            configJson: any;
            startDate: Date;
            endDate: Date;
            balancePoints: number;
            imageBase64: string;
        },
        gameTypeImageBase64s?: {
            id: number;
            imageBase64: string;
        }[];
    }): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistGameTypeById(gameEventData.gameEvent.gameTypeId);

            const addedGameEvent = await this.gameEventRepository.create(gameEventData.gameEvent, session);


            const folderPath = this.configService.get<string>('imagePathConfig.GAMEEVENT_IMAGE_PATH') + `/${addedGameEvent._id}`;
            await this.fileService.createFolder(folderPath);
            if (gameEventData.gameEvent.imageBase64) {
                await this.fileService.saveBase64File(gameEventData.gameEvent.imageBase64, folderPath, "main");
            } else {
                const sourcePath = this.configService.get<string>('imagePathConfig.GAMEEVENT_IMAGE_PATH');
                const destinationPath = folderPath;
                const sourceFileName = 'unknown.jpg';
                const destinationFileName = 'main.jpg';
                await this.fileService.copyFile(sourcePath, sourceFileName, destinationPath, destinationFileName);
            }
            if (gameEventData.gameTypeImageBase64s && gameEventData.gameTypeImageBase64s.length > 0) {
                const gameTypeFolderPath = folderPath + `/gameTypes`;
                await this.fileService.createFolder(gameTypeFolderPath);
                for (const gameTypeImage of gameEventData.gameTypeImageBase64s) {
                    if (gameTypeImage.imageBase64) {
                        await this.fileService.saveBase64File(gameTypeImage.imageBase64, gameTypeFolderPath, String(gameTypeImage.id));
                    } else {
                        const sourcePath = this.configService.get<string>('imagePathConfig.GAMEEVENT_IMAGE_PATH');
                        const destinationPath = gameTypeFolderPath;
                        const sourceFileName = 'unknown.jpg';
                        const destinationFileName = 'main.jpg';
                        await this.fileService.copyFile(sourcePath, sourceFileName, destinationPath, destinationFileName);
                    }
                }
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Create game event failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async getGameEventById(gameEventId: Types.ObjectId): Promise<any> {
        try {
            const gameEvent = await this.getExistGameEventById(gameEventId);
            const gameTypeImageUrls = []
            var isEnough = false;
            var gameTypeImageIndex = 1;
            const { gameEventRewardResults, ...gameEventBase } = gameEvent;
            while (isEnough === false) {

                const gameTypeImageUrl: string = await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.GAMEEVENT_IMAGE_PATH'), gameEventBase._id + "/gameTypes", String(gameTypeImageIndex))
                if (gameTypeImageUrl.includes("/unknown.jpg")) {
                    isEnough = true;
                } else {
                    gameTypeImageUrls.push({
                        id: gameTypeImageIndex,
                        imageUrl: gameTypeImageUrl,
                    });
                }
                gameTypeImageIndex++;

            }
            return {
                gameEvent: {
                    ...gameEventBase,
                    imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.GAMEEVENT_IMAGE_PATH'), gameEventBase._id, "main"),
                },
                gameTypeImageUrls: gameTypeImageUrls,
                gameEventRewardResults: gameEventRewardResults
            }
        } catch (error) {
            throw new HttpException('Get game event failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deactivateGameEvent(gameEventId: Types.ObjectId, isDeactivated: boolean): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistGameEventById(gameEventId);
            await this.gameEventRepository.deactivate(gameEventId, isDeactivated, session);
            await session.commitTransaction();
            return { message: 'Game event deactivated successfully' };
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Deactivate game event failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async getGameTypes(): Promise<any> {
        try {
            const gameTypes = await this.gameTypeRepository.findAll();
            return gameTypes;
        } catch (error) {
            throw new HttpException('Get game types failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getEventsRewardsByAccountId(accountId: Types.ObjectId): Promise<any> {

        try {
            const account = await this.accountsService.getExistAccountById(accountId);
            if (account.isDeactivated == true) {
                throw new HttpException('account is deactivated', HttpStatus.BAD_REQUEST);
            }
            const gameEventRewardResults = await this.gameEventRewardResultRepository.findByAccountId(new Types.ObjectId(accountId));
            const result = [];
            for (const rewardResult of gameEventRewardResults) {
                const { gameEventId: gameEvent, ...rewardResultBase } = rewardResult;
                result.push({
                    gameEventRewardResult: rewardResultBase,
                    gameEvent: {
                        ...gameEvent,
                        imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.GAMEEVENT_IMAGE_PATH'), gameEvent._id, "main"),
                    },
                });
            }
            return result;
        } catch (error) {
            throw new HttpException('Get event rewards failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getGameEventsRewards(): Promise<any> {
        try {
            const gameEventRewardResults = await this.gameEventRewardResultRepository.findAll();
            const result = [];
            for (const rewardResult of gameEventRewardResults) {
                const { gameEventId: gameEvent, ...rewardResultBase } = rewardResult;
                result.push({
                    gameEventRewardResult: rewardResultBase,
                    gameEvent: {
                        ...gameEvent,
                        imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.GAMEEVENT_IMAGE_PATH'), gameEvent._id, "main"),
                    },
                });
            }
            return result;
        } catch (error) {
            throw new HttpException('Get event rewards failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addGameEventReward(accountId: Types.ObjectId, gameEventReward: {
        gameEventId: Types.ObjectId;
        points: number;
    }): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            var account = await this.accountsService.getExistAccountById(accountId);
            if (account.isDeactivated == true) {
                throw new HttpException('account is deactivated', HttpStatus.BAD_REQUEST);
            }
            const gameEvent= await this.getExistGameEventById(gameEventReward.gameEventId);
            if (gameEvent.isDeactivated === true) {
                throw new HttpException('Game event is deactivated', HttpStatus.BAD_REQUEST);
            }

            if(gameEvent.gameEventRewardResults.filter(reward => reward.accountId.toString() === accountId.toString()).length > 0){
                throw new HttpException('You have already received reward for this game event', HttpStatus.BAD_REQUEST);
            }

            const existGameEventRewardResult = await this.gameEventRewardResultRepository.findByGameEventId(gameEventReward.gameEventId);
            const existPointSum = existGameEventRewardResult.reduce((sum, reward) => sum + reward.points, 0);
           
            const gameEventRewardResult = await this.gameEventRewardResultRepository.create({
                points: gameEventReward.points,
                accountId: new Types.ObjectId(accountId) ,
                gameEventId: new Types.ObjectId(gameEventReward.gameEventId)
            }, session);
            
            console.log("existPointSum: ", existPointSum);
            if (existPointSum + gameEventReward.points >=  gameEvent.balancePoints) {
                await this.gameEventRepository.deactivate(gameEventReward.gameEventId, true, session);
            }

            // Update account points
            account.points += gameEventReward.points;
            await this.accountRepository.update(accountId, account, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Add game event reward failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async joinGameEvent(accountId: Types.ObjectId, gameEventId: Types.ObjectId): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const account = await this.accountsService.getExistAccountById(accountId);
            if (account.isDeactivated == true) {
                throw new HttpException('account is deactivated', HttpStatus.BAD_REQUEST);
            }

            if (account.gameTicketCount <= 0) {
                throw new HttpException('You do not have enough game tickets to join this event', HttpStatus.BAD_REQUEST);
            }

            const gameEvent = await this.getExistGameEventById(gameEventId);
            if (gameEvent.isDeactivated === true) {
                throw new HttpException('Game event is deactivated', HttpStatus.BAD_REQUEST);
            }

            account.gameTicketCount -= 1;
            await this.accountRepository.update(accountId, account, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Join game event failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }
}
