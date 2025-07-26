import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GameEventController } from './GameEvent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameEventsService } from './services/gameEvents.service';
import { JwtService } from 'src/common/services/jwt.service';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { FileService } from 'src/common/services/file.service';
import { GameEventRepository } from 'src/database/schemas/gameEvent/gameEvent.repository';
import { GameTypeRepository } from 'src/database/schemas/gameType/gameType.repository';
import { GameEventRewardResultRepository } from 'src/database/schemas/gameEventRewardResult/gameEventRewardResult.repository';
import { GameEvent, GameEventSchema } from 'src/database/schemas/gameEvent/gameEvent.schema';
import { GameType, GameTypeSchema } from 'src/database/schemas/gameType/gameType.schema';
import { GameEventRewardResult, GameEventRewardResultSchema } from 'src/database/schemas/gameEventRewardResult/gameEventRewardResult.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameEvent.name, schema: GameEventSchema },                          // gameEvents
      { name: GameType.name, schema: GameTypeSchema },                            // gameTypes
      { name: GameEventRewardResult.name, schema: GameEventRewardResultSchema },  // gameEventRewardResults
    ]),
    // BookingModule,
    // ServiceModule
  ],
  controllers: [GameEventController],
  providers: [
    // Repositories
    GameEventRepository,
    GameTypeRepository,
    GameEventRewardResultRepository,

    // Inner Services
    GameEventsService,

    // Common Services
    JwtService,
    BcryptService,
    FileService


  ],
  exports: [
    // Repositories
    GameEventRepository,
    GameTypeRepository,
    GameEventRewardResultRepository,

    // Inner Services
    GameEventsService,
  ]
})
export class GameEventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(

    ).forRoutes(
    );
  }
}
