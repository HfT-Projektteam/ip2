import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

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
    await request(app.getHttpServer()).get('/users/test2').send().expect(500);
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
});

afterAll(async () => {
  await app.close();
});
