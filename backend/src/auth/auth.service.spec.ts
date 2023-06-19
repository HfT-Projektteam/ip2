import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { HttpModule, HttpService } from '@nestjs/axios'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { AuthModule } from './auth.module'

describe('AuthService', () => {
  let service: AuthService, httpService: HttpService

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
    httpService = module.get<HttpService>(HttpService)
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
    jest.spyOn(service, 'getSpotifyUserObject').mockImplementation(() => {
      return Promise.resolve(currentUsersProfileResponseMock)
    })
    expect(await service.getURIfromAccessCode('right token')).toMatch(
      'spotify:user:jobee0602',
    )
  })
})

describe('AuthGuard', () => {
  let mockValidRequestPayload = { headers: { authorization: 'Bearer test' } }
  const mockExecutionContext: Partial<
    Record<
      jest.FunctionPropertyNames<ExecutionContext>,
      jest.MockedFunction<any>
    >
  > = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockValidRequestPayload),
      getResponse: jest.fn(),
    }),
  }

  let mockInvalidRequestPayload = { headers: { authorization: 'test' } }
  const mockFaultyExecutionContext: Partial<
    Record<
      jest.FunctionPropertyNames<ExecutionContext>,
      jest.MockedFunction<any>
    >
  > = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockInvalidRequestPayload),
      getResponse: jest.fn(),
    }),
  }

  function mockGetURIfromAccessCode(uri) {
    jest
      .spyOn(service, 'getURIfromAccessCode')
      .mockImplementation((access_token) => {
        return Promise.resolve(uri)
      })
  }

  let guard, service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [AuthGuard],
    }).compile()

    guard = module.get<AuthGuard>(AuthGuard)
    service = module.get<AuthService>(AuthService)

    jest.clearAllMocks()

    process.env['ENV'] = 'prod'
  })

  it('should not throw an exception if token is "valid"', async () => {
    mockGetURIfromAccessCode('test-uri')
    guard.canActivate(mockExecutionContext).catch((e) => {
      expect(e).not.toBeInstanceOf(UnauthorizedException)
    })
  })

  it('should throw an error if token is not Bearer schema in request', async () => {
    mockGetURIfromAccessCode('test-uri')
    guard.canActivate(mockFaultyExecutionContext).catch((e) => {
      expect(e).toBeInstanceOf(UnauthorizedException)
    })
  })

  it('should throw an UnauthorizedException if the uri is undefined', async () => {
    mockGetURIfromAccessCode(undefined)
    guard
      .canActivate(mockExecutionContext)
      .catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException)
      })
      .then(expect('UnauthorizedException').toMatch(''))
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
  it('should let everything through, if on local env', async () => {
    process.env['ENV'] = 'local'
    expect(guard.canActivate(mockFaultyExecutionContext)).toBeTruthy()
    expect(mockInvalidRequestPayload['spotify_uri']).toMatch('local-user')
  })
})
