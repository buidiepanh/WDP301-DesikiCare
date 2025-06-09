import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = exception.getStatus();
    let errorResponse = exception.getResponse();

    // Mặc định lấy message từ HttpException
    let message = typeof errorResponse === 'string' ? errorResponse : (errorResponse as any).message;

    // Nếu là lỗi Unauthorized (401), ta có thể ghi log hoặc xử lý đặc biệt
    if (exception instanceof UnauthorizedException) {
      message = message || 'Bạn chưa được xác thực!';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
