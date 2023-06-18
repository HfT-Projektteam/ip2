import { Test } from '@nestjs/testing'
import { EntityNotFoundExceptionFilter } from './entity-not-found-exception/entity-not-found-exception.filter'
import { CircularFollowerExceptionFilter } from './circular-follower-exception/circular-follower-exception.filter'
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'
import { User } from '../users/entities/user.entity'
import { CircularDependencyException } from '@nestjs/core/errors/exceptions'

let entityNotFound: EntityNotFoundExceptionFilter,
  circularFollower: CircularFollowerExceptionFilter
beforeAll(async () => {
  const module = await Test.createTestingModule({
    providers: [EntityNotFoundExceptionFilter, CircularFollowerExceptionFilter],
  }).compile()
  entityNotFound = module.get<EntityNotFoundExceptionFilter>(
    EntityNotFoundExceptionFilter,
  )
  circularFollower = module.get<CircularFollowerExceptionFilter>(
    CircularFollowerExceptionFilter,
  )
})

describe('Exception stuff', () => {
  const mockJson = jest.fn()
  const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
  }))
  const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
  }))
  const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: jest.fn(),
  }))

  const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  }
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('should catch a EntityNotFoundError and make at 404 HTTP Error', async () => {
    entityNotFound.catch(
      new EntityNotFoundError(User, { spotify_uri: 'test' }),
      mockArgumentsHost,
    )
    expect(mockHttpArgumentsHost).toBeCalledTimes(1)
    expect(mockHttpArgumentsHost).toBeCalledWith()
    expect(mockGetResponse).toBeCalledTimes(1)
    expect(mockGetResponse).toBeCalledWith()
    expect(mockStatus).toBeCalledTimes(1)
    expect(mockStatus).toBeCalledWith(404)
    expect(mockJson).toBeCalledTimes(1)
    expect(mockJson).toBeCalledWith({
      message: {
        statusCode: 404,
        error: 'Not Found',
        message:
          'Could not find any entity of type "User" matching: {\n' +
          '    "spotify_uri": "test"\n' +
          '}',
      },
    })
  })

  it('should catch a CircularDependencyException and make it a 400 HTTP Error', async () => {
    circularFollower.catch(
      new CircularDependencyException('some context'),
      mockArgumentsHost,
    )
    expect(mockHttpArgumentsHost).toBeCalledTimes(1)
    expect(mockHttpArgumentsHost).toBeCalledWith()
    expect(mockGetResponse).toBeCalledTimes(1)
    expect(mockGetResponse).toBeCalledWith()
    expect(mockStatus).toBeCalledTimes(1)
    expect(mockStatus).toBeCalledWith(400)
    expect(mockJson).toBeCalledTimes(1)
    expect(mockJson).toBeCalledWith({
      message: {
        statusCode: 400,
        error: 'Circular Follower Exception',
        message: "A user can't follow himself, that just makes no sense",
      },
    })
  })
})
