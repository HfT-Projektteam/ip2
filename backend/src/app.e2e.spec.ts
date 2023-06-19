import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('should return some random sentence at base)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(
        'Hello World! Not much to see here though, I`m just a backend anyways',
      )
  })

  it('should create a user if signIn is called', async () => {
    await request(app.getHttpServer())
      .post('/signIn')
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({ spotify_uri: 'local-user' })
      })
  })
})
