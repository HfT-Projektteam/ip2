import { Test, TestingModule } from '@nestjs/testing'
import { Pagination } from './pagination'
import { PageMetaInterceptor } from './pagination.interceptor'

describe('Pagination', () => {
  let service: Pagination

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Pagination],
    }).compile()

    service = module.get<Pagination>(Pagination)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // TODO: @Lukas Unit test here
})

describe('PaginationInterceptor', () => {
  let service: PageMetaInterceptor

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageMetaInterceptor],
    }).compile()

    service = module.get<PageMetaInterceptor>(PageMetaInterceptor)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // TODO: @Lukas Unit test here
})
