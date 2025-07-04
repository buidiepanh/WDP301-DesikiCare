import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ChatbotController } from './Chatbot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatbotService } from './services/chatbot.service';
import { JwtService } from 'src/common/services/jwt.service';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { FileService } from 'src/common/services/file.service';``
import { ChatbotConfigRepository } from 'src/database/schemas/chatbotConfig/chatbotConfig.repository';
import { ChatbotConfig, ChatbotConfigSchema } from 'src/database/schemas/chatbotConfig/chatbotConfig.schema';
import { AccountModule } from '../account/Account.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatbotConfig.name, schema: ChatbotConfigSchema },
    ]),
    AccountModule
  ],
  controllers: [ChatbotController],
  providers: [
    // Repositories
    ChatbotConfigRepository,

    // Inner Services
    ChatbotService,

    // Common Services
    JwtService,
    BcryptService,
    FileService


  ],
  exports: [
    // Repositories
    ChatbotConfigRepository,

    // Inner Services
    ChatbotService,
  ]
})
export class ChatbotModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(

    ).forRoutes(
    );
  }
}
