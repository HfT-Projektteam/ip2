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
import { PostsService } from './posts.service'

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
      PostsService,
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

  it('should get one post by id', async () => {
    await request(app.getHttpServer())
      .get(`/posts/${myPostId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            songId: 'test1',
            description: 'test1',
            genre: 'test1',
            likes: 0,
            dislikes: 0,
            uuid: expect.any(String),
            uploaded: expect.any(String),
            creator: {
              spotify_uri: 'local-user',
            },
          }),
        )
      })
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

describe('test like/dislike operations', () => {
  let myPostId: string

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
  })

  it('should like a post and remove like on second like', async () => {
    await request(app.getHttpServer())
      .put(`/posts/${myPostId}/like`)
      .expect(200)
      .expect('true')

    await postRepository.findOneByOrFail({ uuid: myPostId }).then((res) => {
      expect(res.likes).toEqual(1)
    })

    await request(app.getHttpServer())
      .put(`/posts/${myPostId}/like`)
      .expect(200)
      .expect('false')

    await postRepository.findOneByOrFail({ uuid: myPostId }).then((res) => {
      expect(res.likes).toEqual(0)
    })
  })

  it('should dislike a post and remove dislike on second dislike', async () => {
    await request(app.getHttpServer())
      .put(`/posts/${myPostId}/dislike`)
      .expect(200)
      .expect('true')

    await postRepository.findOneByOrFail({ uuid: myPostId }).then((res) => {
      expect(res.dislikes).toEqual(1)
    })

    await request(app.getHttpServer())
      .put(`/posts/${myPostId}/dislike`)
      .expect(200)
      .expect('false')

    await postRepository.findOneByOrFail({ uuid: myPostId }).then((res) => {
      expect(res.dislikes).toEqual(0)
    })
  })

  it('should get true if a post is liked', async () => {
    // await postsService.like(myPostId)
    await request(app.getHttpServer()).put(`/posts/${myPostId}/like`)

    await request(app.getHttpServer())
      .get(`/posts/${myPostId}/like`)
      .expect(200)
      .expect('true')
  })

  it('should get true if a post is disliked', async () => {
    // await postsService.dislike(myPostId)
    await request(app.getHttpServer()).put(`/posts/${myPostId}/dislike`)

    await request(app.getHttpServer())
      .get(`/posts/${myPostId}/dislike`)
      .expect(200)
      .expect('true')
  })

  it('should get false if a post is not liked', async () => {
    await request(app.getHttpServer())
      .get(`/posts/${myPostId}/like`)
      .expect(200)
      .expect('false')
  })

  it('should get false if a post is not disliked', async () => {
    await request(app.getHttpServer())
      .get(`/posts/${myPostId}/dislike`)
      .expect(200)
      .expect('false')
  })

  afterEach(async () => {
    await postRepository.delete({ uuid: myPostId })
    await userRepository.delete({ spotify_uri: 'local-user' })
  })
})

describe('Multiple posts with filter', () => {
  let posts = []
  let localUser
  let secondUser

  beforeAll(async () => {
    localUser = new User('local-user')
    secondUser = new User('second-user')

    await userRepository.save([localUser, secondUser])

    for (let i = 0; i < 5; i++) {
      posts.push(
        new Post(
          {
            song_id: `test${i}`,
            description: `test${i}`,
            genre: `new wave flick flack hip hop`,
          },
          i % 2 === 0 ? localUser : secondUser,
        ),
      )
    }
    await postRepository.save(posts)
    await new Promise((r) => setTimeout(r, 500))
    let olderPost = []
    for (let i = 5; i < 10; i++) {
      olderPost.push(
        new Post(
          {
            song_id: `test${i}`,
            description: `test${i}`,
            genre: `darkest acid underground techno`,
          },
          i % 2 === 0 ? localUser : secondUser,
        ),
      )
    }
    await postRepository.save(olderPost)
    posts = posts.concat(olderPost)
  })

  it('should sort by oldest', async () => {
    await request(app.getHttpServer())
      .get(`/posts`)
      .query({ page: 0, take: 10, sort: 'oldest' })
      .expect(200)
      .expect((res) => {
        expect(
          new Date(res.body.data[0].uploaded) <
            new Date(res.body.data[9].uploaded),
        ).toBeTruthy()
      })
  })

  it('should sort by newest', async () => {
    await request(app.getHttpServer())
      .get(`/posts`)
      .query({ page: 0, take: 10, sort: 'newest' })
      .expect(200)
      .expect((res) => {
        expect(
          new Date(res.body.data[0].uploaded) <
            new Date(res.body.data[9].uploaded),
        ).toBeFalsy()
      })
  })

  it('should filter by genre', async () => {
    await request(app.getHttpServer())
      .get(`/posts`)
      .query({ page: 0, take: 10, genre: 'darkest acid underground techno' })
      .expect(200)
      .expect((res) => {
        res.body.data.forEach((post) => {
          expect(post.genre).toMatch('darkest acid underground techno')
        })
      })
  })

  afterAll(async () => {
    await postRepository.delete(posts)
    await userRepository.delete([localUser, secondUser])
  })
})
afterAll(async () => {
  await app.close()
})
