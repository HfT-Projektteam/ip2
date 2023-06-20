import { Test, TestingModule } from '@nestjs/testing'
import { PostsService } from './posts.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { Post } from './entities/post.entity'

const userArray = [
  {
    spotify_uri: 'firstName #1',
  },
  {
    spotify_uri: 'firstName #2',
  },
]

const oneUser = {
  spotify_uri: 'firstName #1',
}

describe('PostsService', () => {
  let service: PostsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(userArray),
            findOneBy: jest.fn().mockResolvedValue(oneUser),
            save: jest.fn().mockResolvedValue(oneUser),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile()

    service = await module.resolve<PostsService>(PostsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
