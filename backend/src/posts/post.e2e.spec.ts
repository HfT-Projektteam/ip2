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
        database: 'e2e_post',
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

describe('test basic CRUD operations', () => {
  let myPostId: string
  let strangePostId: string

  beforeEach(async () => {
    const localUser = new User('local-user')
    await userRepository.save(localUser)

    await postRepository.save(
      new Post(
        { song_id: 'test1', description: 'test1', genre: 'test1' },
        localUser,
      ),
    )

    myPostId = await postRepository
      .findOneByOrFail({ songId: 'test1' })
      .then((post) => post.uuid)

    const secondUser = new User('second-user')
    await userRepository.save(secondUser)

    await postRepository.save(
      new Post(
        { song_id: 'test2', description: 'test2', genre: 'test2' },
        secondUser,
      ),
    )

    strangePostId = await postRepository
      .findOneByOrFail({ songId: 'test2' })
      .then((post) => post.uuid)
  })

  it('should create and save a post', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({ song_id: 'test', description: 'test', genre: 'test' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            songId: 'test',
            description: 'test',
            genre: 'test',
            creator: 'local-user',
            uuid: expect.any(String),
            uploaded: expect.any(String),
            likes: 0,
            dislikes: 0,
          }),
        )
        postRepository.delete({ uuid: res.body.uuid })
      })
  })

  it('should change the description of a post', async () => {
    await request(app.getHttpServer())
      .patch(`/posts/${myPostId}`)
      .send({ description: 'This was updated2' })
      .expect(200)
      .expect('true')

    await postRepository.findOneByOrFail({ uuid: myPostId }).then((res) => {
      expect(res.description).toEqual('This was updated2')
    })
  })

  it('should not edit a post that does not belong to a user', async () => {
    await request(app.getHttpServer())
      .patch(`/posts/${strangePostId}`)
      .send({ description: 'This was updated2' })
      .expect(401)
      .expect(
        '{"statusCode":401,"message":"Only post creators can edit them","error":"Unauthorized"}',
      )
  })

  it('should delete a post', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${myPostId}`)
      .expect(200)
      .expect('{"raw":[],"affected":1}')

    await postRepository.exist({ where: { uuid: myPostId } }).then((res) => {
      expect(res).toBeFalsy()
    })
  })

  it('should not delete a post that does not belong to a user', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${strangePostId}`)
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Only post creators can delete them',
        error: 'Unauthorized',
      })
  })

  afterEach(async () => {
    await postRepository.delete({ uuid: myPostId })
    await postRepository.delete({ uuid: strangePostId })

    await userRepository.delete({ spotify_uri: 'local-user' })
    await userRepository.delete({ spotify_uri: 'second-user' })
  })
})

afterAll(async () => {
  await app.close()
})
