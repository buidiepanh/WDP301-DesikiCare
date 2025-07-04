import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { DatabaseConfig } from './config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppMigration } from './app.migration';
import { databaseFeatures } from './database/database.feature';
import { AccountModule } from './modules/account/Account.module';
import { ProductModule } from './modules/product/Product.module';
import { OrderModule } from './modules/order/Order.module';
import { ChatbotModule } from './modules/chatbot/Chatbot.module';
import { GameModule } from './modules/game/Game.module';

//*** thứ tự thực thi */
//1. Load các module trong imports
//  + ConfigModule chờ generalConfiguration và mongo_databaseConfiguration chạy xong
//  + DatabaseModule chờ ConfigModule chạy xong

//2. Load các controller trong controllers
//3. Load các provider trong providers

@Module({
  imports: [
    AccountModule,
    GameModule,
    ProductModule,
    OrderModule,
    ChatbotModule,
    DatabaseModule,


    ConfigModule.forRoot({  // Configure cho ConfigService
      isGlobal: true,
      load: [AppConfig, DatabaseConfig],
    }),
    MongooseModule.forFeature(
      //** name ở đây để sử dụng trong @InjectModel inject trong service/controller, @InjectModel(User.name) 
      databaseFeatures
    ),


  ],                                    // Import các module khác vào module này
  controllers: [AppController],         // Đăng ký danh sách controller cho module này
  providers: [                          // Đăng ký danh sách provider (service, repository, helper...) để có thể inject vào controller hoặc các service khác
    AppService,
    AppMigration
  ],
})
export class AppModule { }

