import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {getRepositoryToken} from "@nestjs/typeorm";

const userArray = [
  {
    spotify_uri: 'firstName #1',
  },
  {
    spotify_uri: 'firstName #2',
  },
];

const oneUser = {
  spotify_uri: 'firstName #1',
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(userArray),
            findOneBy: jest.fn().mockResolvedValue(oneUser),
            save: jest.fn().mockResolvedValue(oneUser),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User))
  });

  //For stateless test see here: https://github.com/nestjs/nest/blob/master/sample/05-sql-typeorm/src/users/users.service.spec.ts
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
