import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'
import { Repository } from 'typeorm'

import { User } from '../users/entities/user.entity'
import { Post } from './entities/post.entity'
import { PostsModule } from './posts.module'

import * as request from 'supertest'

import { ConfigModule } from '@nestjs/config'
import configOptions from '../config/config'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '../auth/auth.guard'
import { AppService } from '../app.service'
import { UsersService } from '../users/users.service'
import { UsersModule } from '../users/users.module'
import { AuthModule } from '../auth/auth.module'

let app: INestApplication
let postRepository: Repository<Post>
let userRepository: Repository<User>

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      UsersModule,
      AuthModule,
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
    providers: [
      UsersService,
      {
        provide: APP_GUARD,
        useClass: AuthGuard,
      },
    ],
  }).compile()
  app = module.createNestApplication()
  await app.init()

  postRepository = module.get('PostRepository')
  userRepository = module.get('UserRepository')

  await userRepository.save({ spotify_uri: 'local-user' })
})

describe('Test basic DB connectivity', () => {
  it.skip('should create and save a post', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({ song_id: 'test1', description: 'test1', genre: 'test1' })
      .expect(201)
      .expect({
        songId: 'test1',
        description: 'test1',
        genre: 'test1',
        creator: 'local-user',
        likes: 0,
        dislikes: 0,
      })
  })
})

afterAll(async () => {
  await app.close()
})
