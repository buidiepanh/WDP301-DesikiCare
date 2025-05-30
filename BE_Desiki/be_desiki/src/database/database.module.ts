import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // MongooseModule.forRoot(connectionString),  // Config cứng (truyền trực tiếp chuỗi kết nối)

    // ConfigModule,                     // Import ConfigModule khi isGlobal = false khi gọi ConfigModule.forRoot trong AppModule, Module ConfigModule này được import để dùng trong Module này, không liên quan ảnh hưởng đến MongooseModule.forRootAsync
    MongooseModule.forRootAsync({
      
      // imports: [ConfigModule],        // Import ConfigModule khi isGlobal = false khi gọi ConfigModule.forRoot trong AppModule, import này giúp lấy ConfigService trong hàm useFactory
      
      useFactory: async (configService: ConfigService) => ({    // Hàm useFactory sẽ chạy khi ứng dụng khởi động và trả về một đối tượng cấu hình (tức là chờ ConfigService)
        uri: configService.get<string>('mongoDbConfig.CONNECTION_STRING'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],           // Inject có thể xem nó như là một mảng các provider
    }),
  ],
})
export class DatabaseModule {}
