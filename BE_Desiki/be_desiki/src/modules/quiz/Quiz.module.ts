import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { QuizController } from './Quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizService } from './services/quiz.service';
import { JwtService } from 'src/common/services/jwt.service';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { FileService } from 'src/common/services/file.service';
import { QuizQuestionRepository } from 'src/database/schemas/quizQuestion/quizQuestion.repository';
import { QuizOptionRepository } from 'src/database/schemas/quizOption/quizOption.repository';
import { QuizOptionSkinTypeRepository } from 'src/database/schemas/quizOptionSkinType/quizOptionSkinType.repository';
import { QuizOptionSkinStatusRepository } from 'src/database/schemas/quizOptionSkinStatus/quizOptionSkinStatus.repository';
import { QuizQuestion, QuizQuestionSchema } from 'src/database/schemas/quizQuestion/quizQuestion.schema';
import { QuizOption, QuizOptionSchema } from 'src/database/schemas/quizOption/quizOption.schema';
import { QuizOptionSkinType, QuizOptionSkinTypeSchema } from 'src/database/schemas/quizOptionSkinType/quizOptionSkinType.schema';
import { QuizOptionSkinStatus, QuizOptionSkinStatusSchema } from 'src/database/schemas/quizOptionSkinStatus/quizOptionSkinStatus.schema';
import { AccountModule } from '../account/Account.module';
import { ProductModule } from '../product/Product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizQuestion.name, schema: QuizQuestionSchema },                    // quizQuestions
      { name: QuizOption.name, schema: QuizOptionSchema },                        // quizOptions
      { name: QuizOptionSkinType.name, schema: QuizOptionSkinTypeSchema },        // quizOptionSkinTypes
      { name: QuizOptionSkinStatus.name, schema: QuizOptionSkinStatusSchema },    // quizOptionSkinStatus
    ]),
    AccountModule,
    ProductModule
  ],
  controllers: [QuizController],
  providers: [
    // Repositories
    QuizQuestionRepository,
    QuizOptionRepository,
    QuizOptionSkinTypeRepository,
    QuizOptionSkinStatusRepository,

    // Inner Services
    QuizService,

    // Common Services
    JwtService,
    BcryptService,
    FileService
  ],
  exports: [
    // Repositories
    QuizQuestionRepository,
    QuizOptionRepository,
    QuizOptionSkinTypeRepository,
    QuizOptionSkinStatusRepository,

    // Inner Services
    QuizService,
  ]
})
export class QuizModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(

    ).forRoutes(
    );
  }
}
