import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { APP_FILTER } from '@nestjs/core';
import { EntityNotFoundExceptionFilter } from './entity-not-found-exception/entity-not-found-exception.filter';
import { CircularFollowerExceptionFilter } from './circular-follower-exception/circular-follower-exception.filter';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { User } from '../users/entities/user.entity';

let app: INestApplication;
beforeAll(async () => {
  const module = await Test.createTestingModule({
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
});

describe('Exception stuff', () => {
  it.todo('should catch a EntityNotFoundError and make at 404 HTTP Error');
  // Könnte man auch hier das Ergebnis abfangen und so ohne e2e testen?
  // throw new EntityNotFoundError(User, 'Test');
});

afterAll(async () => {
  await app.close();
});
