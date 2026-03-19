import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ apiVersion: string; data: unknown }> {
    console.log('DataResponseInterceptor');
    return next.handle().pipe(
      map((data: unknown) => {
        return {
          apiVersion: this.configService.get('app.apiVersion') ?? '0.1.0',
          data,
        };
      }),
    );
  }
}
