import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ResponseSuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();

    //tap -> quan sát data/ loggin/ side effect 
    //map -> biến đổi data thành định dạng response chuẩn
    return next.handle().pipe(
      map((data) => {
        return {
          status: 'success',
          statusCode: res.statusCode,
          data: data,
        };
      }),
    );
  }
}
