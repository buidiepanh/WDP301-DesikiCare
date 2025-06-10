import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';

export function UnauthorizedExceptionViewRedirectFilter(redirectTo: string): ExceptionFilter {
    @Catch(UnauthorizedException)
    class RedirectFilter implements ExceptionFilter {
        catch(exception: UnauthorizedException, host: ArgumentsHost) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            
            response.redirect(redirectTo); // 🔄 Redirect đến URL được truyền vào
        }
    }
    return new RedirectFilter(); // Trả về instance của filter
}
