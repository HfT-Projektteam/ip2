import { SelectQueryBuilder } from 'typeorm';

export class Pagination {
  private static PAGE_SIZE = 10;

  private static getSkip(page: number): number {
    if (page < 0) {
      throw new PagingError('Page number must be positive');
    }
    return page * this.PAGE_SIZE;
  }

  static pageQuery(
    query: SelectQueryBuilder<any>,
    page: number,
  ): SelectQueryBuilder<any> {
    return query.skip(this.getSkip(page)).take(this.PAGE_SIZE);
  }

  static;
}

export class PagingError extends Error {
  constructor(message: string) {
    super(message);
  }
}
