import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'
import { UsersModule } from './users.module'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as request from 'supertest'
import { APP_FILTER } from '@nestjs/core'
import { EntityNotFoundExceptionFilter } from '../filters/entity-not-found-exception/entity-not-found-exception.filter'
import { CircularFollowerExceptionFilter } from '../filters/circular-follower-exception/circular-follower-exception.filter'
import { ConfigModule } from '@nestjs/config'
import configOptions from '../config/config'
import { Post } from '../posts/entities/post.entity'

let app: INestApplication
let repository: Repository<User>, postRepository: Repository<Post>

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      UsersModule,
      ConfigModule.forRoot(configOptions),
      // Use the e2e_test database to run the tests
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'e2e_user',
        entities: ['./**/*.entity.ts'],
        synchronize: true,
      }),
    ],
    providers: [
      {
        provide: APP_FILTER,
        useClass: EntityNotFoundExceptionFilter,
      },
      {
        provide: APP_FILTER,
        useClass: CircularFollowerExceptionFilter,
      },
    ],
  }).compile()
  app = module.createNestApplication()
  await app.init()

  repository = module.get('UserRepository')
  postRepository = module.get('PostRepository')
})

describe('Test basic DB connectivity', () => {
  beforeEach(async () => {
    await repository.save({ spotify_uri: 'uff_test1' })
  })
  it('should create and save a user', async () => {
    expect(
      await repository.exist({ where: { spotify_uri: 'uff_test1' } }),
    ).toBeTruthy()
  })

  it('should delete a user', async () => {
    await request(app.getHttpServer())
      .delete('/users/uff_test1')
      .send()
      .expect(200)
    expect(
      await repository.exist({ where: { spotify_uri: 'uff_test1' } }),
    ).toBeFalsy()
  })

  it('should return a user by id', async () => {
    await request(app.getHttpServer())
      .get('/users/uff_test1')
      .send()
      .expect(200)
      .expect('{"spotify_uri":"uff_test1"}')
  })

  it('should only return a user, if id matches exactly', async () => {
    await request(app.getHttpServer()).get('/users/test2').send().expect(404)
  })
  afterEach(async () => {
    await repository.delete({ spotify_uri: 'uff_test1' })
  })
})

describe('Pagination', () => {
  let users = []
  for (let i = 0; i < 20; i++) {
    users.push({ spotify_uri: 'raise' + i })
  }
  beforeAll(async () => {
    await repository.save(users)
  })
  it.each`
    page | take  | expectedLength
    ${0} | ${10} | ${10}
    ${1} | ${10} | ${10}
    ${2} | ${10} | ${0}
    ${2} | ${9}  | ${2}
  `(
    'should return all users with given pagination limit and take',
    async ({ page, take, expectedLength }) => {
      await request(app.getHttpServer())
        .get('/users')
        .query({ page: page, take: take })
        .send()
        .expect(200)
        .expect((res) => {
          console.log(res.body)
          expect(res.body.data).toHaveLength(expectedLength)
        })
    },
  )

  it('should provide hateoas like links for the next page with same take', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .query({ page: 0, take: 10 })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.meta.next).toMatch('/users?page=1&take=10')
        expect(res.body.meta.self).toMatch('/users?page=0&take=10')
      })
  })

  it('should find a user by search query', async () => {
    await request(app.getHttpServer())
      .get('/users/ise1/search')
      .query({ page: 0, take: 10 })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toMatchObject([
          { spotify_uri: 'raise1' },
          { spotify_uri: 'raise10' },
          { spotify_uri: 'raise11' },
          { spotify_uri: 'raise12' },
          { spotify_uri: 'raise13' },
          { spotify_uri: 'raise14' },
          { spotify_uri: 'raise15' },
          { spotify_uri: 'raise16' },
          { spotify_uri: 'raise17' },
          { spotify_uri: 'raise18' },
        ])
        expect(res.body.meta.itemCount).toBe(11)
      })
  })

  afterAll(async () => {
    await repository.delete(users)
  })
})

describe('Exception stuff', () => {
  beforeAll(async () => {
    await repository.save({ spotify_uri: 'test1' })
  })
  it('should throw a 400 error if users tries to follow himself', async () => {
    await request(app.getHttpServer())
      .post('/users/test1/followings/test1')
      .send()
      .expect(400)
      .expect((res) => {
        expect(res.body).toMatchObject({
          message: {
            statusCode: 400,
            error: 'Circular Follower Exception',
            message: "A user can't follow himself, that just makes no sense",
          },
        })
      })
  })

  it('should throw a 404 entity not found if spotify_uri is not know', async () => {
    await request(app.getHttpServer())
      .get('/users/thisUserDoesNotExist')
      .send()
      .expect(404)
      .expect((res) => {
        expect(res.body).toMatchObject({
          message: {
            statusCode: 404,
            error: 'Not Found',
            message:
              'Could not find any entity of type "User" matching: {\n' +
              '    "spotify_uri": "thisUserDoesNotExist"\n' +
              '}',
          },
        })
      })
  })

  afterAll(async () => {
    await repository.delete(['test1', 'test2'])
  })
})

describe('Follower Stuff', () => {
  beforeEach(async () => {
    await repository.save({ spotify_uri: 'followertest1' })
    await repository.save({ spotify_uri: 'followertest2' })
  })

  it('should make one user follow another (only once)', async () => {
    await request(app.getHttpServer())
      .post('/users/followertest1/followings/followertest2')
      .expect((res) => {
        expect(res.body).toMatchObject({
          spotify_uri: 'followertest1',
          following: [{ spotify_uri: 'followertest2' }],
        })
      })

    await request(app.getHttpServer())
      .post('/users/followertest1/followings/followertest2')
      .expect((res) => {
        expect(res.body).toMatchObject({
          spotify_uri: 'followertest1',
          following: [{ spotify_uri: 'followertest2' }],
        })
      })
  })

  it('should check if one user is following another', async () => {
    const follwedUser = new User('followertest2')
    follwedUser.following = [new User('followertest1')]
    await repository.save(follwedUser)

    await request(app.getHttpServer())
      .get('/users/followertest2/followings/followertest1')
      .expect((res) => {
        expect(res.body.doesUserFollowUser).toBeTruthy()
      })

    await request(app.getHttpServer())
      .get('/users/followertest2/followings/followertest2')
      .expect((res) => {
        expect(res.body.doesUserFollowUser).toBeFalsy()
      })
  })

  it('should return all users a given user follows', async () => {
    const followedUser = new User('followertest2')
    followedUser.following = [new User('followertest1')]
    await repository.save(followedUser)

    await request(app.getHttpServer())
      .get('/users/followertest2/followings')
      .query({ page: 0, take: 10 })
      .expect((res) => {
        expect(res.body.data[0].spotify_uri).toMatch('followertest1')
      })
  })

  it('should return all users a given user is followed by', async () => {
    const followedUser = new User('followertest2')
    followedUser.following = [new User('followertest1')]
    await repository.save(followedUser)

    await request(app.getHttpServer())
      .get('/users/followertest1/follower')
      .query({ page: 0, take: 10 })
      .expect((res) => {
        expect(res.body.data[0].spotify_uri).toMatch('followertest2')
      })
  })

  afterEach(async () => {
    await repository.delete(['followertest1', 'followertest2'])
  })
})

describe('Posts of User', () => {
  let myPostId

  beforeAll(async () => {
    const localUser = new User('test1')
    await repository.save(localUser)
    await repository.save(new User('test2'))
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
  it('should return posts of a user', async () => {
    await request(app.getHttpServer())
      .get('/users/test1/posts')
      .query({ page: 0, take: 10 })
      .expect((res) => {
        expect(res.body.data[0].songId).toMatch('test1')
      })
    await request(app.getHttpServer())
      .get('/users/test2/posts')
      .query({ page: 0, take: 10 })
      .expect((res) => {
        expect(res.body.data).toHaveLength(0)
      })
  })
  afterAll(async () => {
    await repository.delete(['test1', 'test2'])
    await postRepository.delete({ uuid: myPostId })
  })
})

afterAll(async () => {
  await app.close()
})
