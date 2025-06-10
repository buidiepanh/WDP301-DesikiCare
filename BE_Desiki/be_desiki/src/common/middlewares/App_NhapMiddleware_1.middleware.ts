import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class App_NhapMiddleware_1 implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Middleware APP 1 (Toan Cuc AppModule) [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next(); // Tiếp tục đến middleware hoặc controller tiếp theo
  }
}
