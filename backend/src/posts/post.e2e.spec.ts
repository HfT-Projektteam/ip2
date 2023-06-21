import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'
import { Repository } from 'typeorm'

import { Post } from './entities/post.entity'
import { PostsModule } from './posts.module'

import * as request from 'supertest'

import { ConfigModule } from '@nestjs/config'
import configOptions from '../config/config'

let app: INestApplication
let repository: Repository<Post>

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      PostsModule,
      ConfigModule.forRoot(configOptions),
      // Use the e2e_test database to run the tests
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_TEST_SCHEMA,
        entities: ['./**/*.entity.ts'],
        synchronize: true,
      }),
    ],
  }).compile()
  app = module.createNestApplication()
  await app.init()

  repository = module.get('PostRepository')
})

describe('Test basic DB connectivity', () => {
  it('should create and save a post', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({ songId: 'test1', description: 'test1', genre: 'test1' })
      .expect(201)
      .expect({
        songId: 'test1',
        description: 'test1',
        genre: 'test1',
        creator: 'local-user',
        uuid: '90c21b93-cc5c-42de-96fc-d1d85b06786f',
        uploaded: '2023-06-21T11:41:00.732Z',
        likes: 0,
        dislikes: 0,
      })
  })
})

afterAll(async () => {
  await app.close()
})
