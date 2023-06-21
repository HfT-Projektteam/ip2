import { Inject, Injectable, Scope } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService, // private usersService: UsersService,
  ) {}

  async getURIfromAccessCode(access_token) {
    return this.getSpotifyUserObject(access_token).then((user) => {
      return user?.uri
    })
  }

  async getSpotifyUserObject(
    access_token,
  ): Promise<undefined | SpotifyApi.CurrentUsersProfileResponse> {
    const api_url = 'https://api.spotify.com/v1/me'
    return firstValueFrom(
      this.httpService.get<SpotifyApi.CurrentUsersProfileResponse>(api_url, {
        headers: { Authorization: 'Bearer ' + access_token },
      }),
    )
      .then((response) => {
        return response.data
      })
      .catch((reason) => {
        return undefined
      })
  }
}
