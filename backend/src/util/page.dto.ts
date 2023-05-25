import { ApiProperty } from '@nestjs/swagger';

const PAGE_SIZE = 20;

export class Page<T> {
  constructor(data: T[], totalEntries, baseRoute, page) {
    this.data = data;
    this.links = new PageLinks(totalEntries, baseRoute, page);
  }

  @ApiProperty({
    description: 'The results of the Service',
  })
  data: T[];
  @ApiProperty()
  links: PageLinks;
}

export class PageLinks {
  constructor(totalEntries, baseRoute, page) {
    this.self = baseRoute + '?page=' + page;
  }

  @ApiProperty()
  self: string;
  @ApiProperty()
  next: string;
  @ApiProperty()
  last: string;
  @ApiProperty()
  pageSize: number = PAGE_SIZE;
}
