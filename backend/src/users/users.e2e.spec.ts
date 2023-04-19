// Maybe move this in users.controller.spec.ts or should that be stateless too?

import {INestApplication} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Test} from "@nestjs/testing";
import { UsersModule } from './users.module';
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import supertest from "supertest";

let app: INestApplication;
let repository: Repository<User>;

beforeAll(async () => {
    const module = await Test.createTestingModule({
        imports: [
            UsersModule,
            // Use the e2e_test database to run the tests
            TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
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

describe("Create Users", () => {
    it("should create and save two users", () => {
        supertest.agent(app.getHttpServer()).post('/users')
    })
})