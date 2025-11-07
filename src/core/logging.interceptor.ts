import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new LoggerService();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const debut = Date.now();

    this.logger.log(
      `Requête entrante : ${method} ${url}`,
      'LoggingInterceptor',
    );

    if (Object.keys(body).length > 0) {
      this.logger.debug(
        `Corps de la requête : ${JSON.stringify(body)}`,
        'LoggingInterceptor',
      );
    }

    return next.handle().pipe(
      tap((data) => {
        const tempsReponse = Date.now() - debut;
        this.logger.log(
          `Réponse envoyée : ${method} ${url} - ${tempsReponse} ms`,
          'LoggingInterceptor',
        );
      }),
    );
  }
}
