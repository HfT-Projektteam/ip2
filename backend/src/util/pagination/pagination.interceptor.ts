import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { Page } from './page.dto'

@Injectable()
export class PageMetaInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Page<any>> | Promise<Observable<Page<any>>> {
    return next.handle().pipe(
      map((res) => {
        const reqUrl = context.switchToHttp().getRequest().originalUrl
        res.meta.self = reqUrl
        res.meta.next = reqUrl.replace(
          /page=[0-9]+/,
          'page=' + (parseInt(res.meta.page) + 1),
        )
        return res
      }),
    )
  }
}
