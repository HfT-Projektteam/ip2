// noinspection ExceptionCaughtLocallyJS

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'
import * as process from 'process'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (process.env.ENV == 'local' || process.env.ENV == 'ci_cd') {
      request['spotify_uri'] = 'local-user'
      return true
    }

    if (!token) throw new UnauthorizedException()

    try {
      const uri = await this.authService.getURIfromAccessCode(token)
      if (uri == undefined) throw new UnauthorizedException()

      request['spotify_uri'] = uri
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
