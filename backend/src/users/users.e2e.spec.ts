// Maybe move this in users.controller.spec.ts or should that be stateless too?

import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as request from 'supertest';
import describe from 'node:test';

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

afterAll(async () => {
  await app.close();
});

describe('CRUD', () => {
  it('should create and save a user', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ spotify_uri: 'test1' })
      .expect(201);

    expect(
      await repository.exist({ where: { spotify_uri: 'test1' } }),
    ).toBeTruthy();
  });

  it.todo('should delete a user');
  it.todo('should find a user by id');
});

describe('Follower stuff', () => {
  it.todo('should add other user to following ', async () => {});
});
