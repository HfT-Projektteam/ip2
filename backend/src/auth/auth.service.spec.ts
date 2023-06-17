import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { HttpModule, HttpService } from '@nestjs/axios'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { AuthModule } from './auth.module'

describe('AuthService', () => {
  let service: AuthService

  const currentUsersProfileResponseMock: SpotifyApi.CurrentUsersProfileResponse =
    {
      birthdate: '-1',
      country: 'DE',
      display_name: 'Be.Bunkert',
      email: 'some.mail@gmx.de',
      external_urls: {
        spotify: 'https://open.spotify.com/user/jobee0602',
      },
      followers: {
        href: null,
        total: 15,
      },
      href: 'https://api.spotify.com/v1/users/jobee0602',
      id: 'jobee0602',
      images: [
        {
          url: 'https://i.scdn.co/image/non-of-ur-business',
          height: null,
          width: null,
        },
      ],
      product: 'premium',
      type: 'user',
      uri: 'spotify:user:jobee0602',
    }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AuthService],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should recognize an old or invalid access token', async () => {
    expect(
      await service.getURIfromAccessCode('worng access token'),
    ).toBeUndefined()
  })
  it('should return the correct uri if access token is correct', async () => {
    jest
      .spyOn(service, 'getSpotifyUserObject')
      .mockImplementation((access_token) => {
        return Promise.resolve(currentUsersProfileResponseMock)
      })
    expect(await service.getURIfromAccessCode('right token')).toMatch(
      'spotify:user:jobee0602',
    )
  })
})

describe('AuthGuard', () => {
  const mockExecutionContext: Partial<
    Record<
      jest.FunctionPropertyNames<ExecutionContext>,
      jest.MockedFunction<any>
    >
  > = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest
        .fn()
        .mockReturnValue({ headers: { authorization: 'Bearer test' } }),
      getResponse: jest.fn(),
    }),
  }

  let guard, service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [AuthGuard],
    }).compile()

    guard = module.get<AuthGuard>(AuthGuard)
    service = module.get<AuthService>(AuthService)

    jest
      .spyOn(service, 'getURIfromAccessCode')
      .mockImplementation((access_token) => {
        return Promise.resolve('test-uri')
      })
  })
  it('should not throw an exception if token is "valid"', async () => {
    expect(() => {
      guard.canActivate(mockExecutionContext)
    }).not.toThrowError(UnauthorizedException)
  })

  it.skip('should throw an error if token is not Bearer schema in request', async () => {
    const mockFaultyExecutionContext: Partial<
      Record<
        jest.FunctionPropertyNames<ExecutionContext>,
        jest.MockedFunction<any>
      >
    > = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest
          .fn()
          .mockReturnValue({ headers: { authorization: 'test' } }),
        getResponse: jest.fn(),
      }),
    }
    try {
      guard.canActivate(mockFaultyExecutionContext)
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException)
    }
  })
  it('should only extract Bearer token from auth header', async () => {
    expect(
      guard.extractTokenFromHeader({ headers: { authorization: 'test' } }),
    ).toBeUndefined()
  })
  it('should fail if no token is given', async () => {
    expect(guard.extractTokenFromHeader({ headers: {} })).toBeUndefined()
  })
  it('should return token and strip if bearer token', async () => {
    expect(
      guard.extractTokenFromHeader({
        headers: { authorization: 'Bearer test' },
      }),
    ).toMatch('test')
  })
})
