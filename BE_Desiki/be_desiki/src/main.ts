import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './common/filters/HttpException.filter';
import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {

  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());         

  const configService = app.get(ConfigService);        
  const port = configService.get<number>('appConfig.APP_PORT') || 8000;
  const baseUrl = configService.get<string>('appConfig.BASE_URL') || 'http://localhost:8000';

  app.enableCors({ origin: '*' });

  app.useStaticAssets(join(__dirname, '..'));

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(port);
  console.log(`Application is running on: ${baseUrl}`);
  console.log("MongoDB connected: "+ configService.get<string>('mongoDbConfig.CONNECTION_STRING'))

}
bootstrap();
