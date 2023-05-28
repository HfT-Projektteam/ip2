import { SelectQueryBuilder } from 'typeorm';
import { PageOptionsDto } from './page.dto';

export class Pagination {
  private static getSkip(options: PageOptionsDto): number {
    return options.page * options.take;
  }

  static pageQuery(
    query: SelectQueryBuilder<any>,
    options: PageOptionsDto,
  ): SelectQueryBuilder<any> {
    return query.skip(this.getSkip(options)).take(options.take);
  }
}

export class PagingError extends Error {
  constructor(message: string) {
    super(message);
  }
}
