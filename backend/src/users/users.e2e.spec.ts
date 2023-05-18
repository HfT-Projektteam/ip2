import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';
import { APP_FILTER } from '@nestjs/core';
import { EntityNotFoundExceptionFilter } from '../filters/entity-not-found-exception/entity-not-found-exception.filter';
import { CircularFollowerExceptionFilter } from '../filters/circular-follower-exception/circular-follower-exception.filter';

let app: INestApplication;
let repository: Repository<User>;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      UsersModule,
      // Use the e2e_test database to run the tests
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'e2e_test',
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
  }).compile();
  app = module.createNestApplication();
  await app.init();

  repository = module.get('UserRepository');
});

describe('Test basic DB connectivity', () => {
  beforeEach(async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ spotify_uri: 'test1' })
      .expect(201);
  });
  it('should create and save a user', async () => {
    expect(
      await repository.exist({ where: { spotify_uri: 'test1' } }),
    ).toBeTruthy();
  });

  it('should delete a user', async () => {
    await request(app.getHttpServer())
      .delete('/users/test1')
      .send()
      .expect(200);
    expect(
      await repository.exist({ where: { spotify_uri: 'test1' } }),
    ).toBeFalsy();
  });

  it('should return a user by id', async () => {
    await request(app.getHttpServer())
      .get('/users/test1')
      .send()
      .expect(200)
      .expect('{"spotify_uri":"test1"}');
  });

  it('should only return a user, if id matches exactly', async () => {
    await request(app.getHttpServer()).get('/users/test2').send().expect(404);
  });
  afterEach(async () => {
    await repository.delete({ spotify_uri: 'test1' });
  });
});

describe('Pagination', () => {
  beforeAll(async () => {
    let users = [];
    for (let i = 0; i < 20; i++) {
      users.push({ spotify_uri: uuid() });
    }
    await repository.save(users);
  });
  it('should return all users with pagination limit 10', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .query({ limit: 10 })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(10);
      });
  });

  it('should provide hateoas like links for the next page', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .query({ limit: 10 })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.links.next).toBeDefined();
      });
  });

  afterAll(async () => {
    await repository.clear();
  });
});

describe('Exception stuff', () => {
  beforeAll(async () => {
    await repository.save({ spotify_uri: 'test1' });
  });
  it('should throw a 400 error if users tries to follow himself', async () => {
    await request(app.getHttpServer())
      .post('/users/test1/follower/test1')
      .send()
      .expect(400)
      .expect((res) => {
        expect(res.body).toMatchObject({
          message: {
            statusCode: 400,
            error: 'Circular Follower Exception',
            message: "A user can't follow himself, that just makes no sense",
          },
        });
      });
  });

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
        });
      });
  });

  afterAll(async () => {
    await repository.delete(['test1', 'test2']);
  });
});

describe('Follower Stuff', () => {
  beforeEach(async () => {
    await repository.save({ spotify_uri: 'test1' });
    await repository.save({ spotify_uri: 'test2' });
  });

  it('should make one user follow another (only once)', async () => {
    await request(app.getHttpServer())
      .post('/users/test1/follower/test2')
      .expect((res) => {
        expect(res.body).toMatchObject({
          spotify_uri: 'test1',
          following: [{ spotify_uri: 'test2' }],
        });
      });

    await request(app.getHttpServer())
      .post('/users/test1/follower/test2')
      .expect((res) => {
        expect(res.body).toMatchObject({
          spotify_uri: 'test1',
          following: [{ spotify_uri: 'test2' }],
        });
      });
  });

  it('should check if one user is following another', async () => {
    const follwedUser = new User('test2');
    follwedUser.following = [new User('test1')];
    await repository.save(follwedUser);

    await request(app.getHttpServer())
      .get('/users/test2/follower/test1')
      .expect((res) => {
        expect(res.body.doesUserFollowUser).toBeTruthy();
      });

    await request(app.getHttpServer())
      .get('/users/test2/follower/test2')
      .expect((res) => {
        expect(res.body.doesUserFollowUser).toBeFalsy();
      });
  });

  it('should return all users a given user follows', async () => {
    const follwedUser = new User('test2');
    follwedUser.following = [new User('test1')];
    await repository.save(follwedUser);

    await request(app.getHttpServer())
      .get('/users/test2/followings')
      .expect((res) => {
        console.log(res.body);
      });
  });

  afterEach(async () => {
    await repository.delete(['test1', 'test2']);
  });
});

afterAll(async () => {
  await app.close();
});
