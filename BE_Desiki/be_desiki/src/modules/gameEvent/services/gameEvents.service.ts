import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { GameEventRepository } from 'src/database/schemas/gameEvent/gameEvent.repository';
import { GameTypeRepository } from 'src/database/schemas/gameType/gameType.repository';
import { GameEventRewardResultRepository } from 'src/database/schemas/gameEventRewardResult/gameEventRewardResult.repository';

@Injectable()
export class GameEventsService {
    constructor(
        private readonly gameEventRepository: GameEventRepository,
        private readonly gameTypeRepository: GameTypeRepository,
        private readonly gameEventRewardResultRepository: GameEventRewardResultRepository,

        // @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }



}
