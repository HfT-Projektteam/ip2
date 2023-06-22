import { SelectQueryBuilder } from 'typeorm'
import { PageOptionsDto } from './page.dto'
import { Injectable } from '@nestjs/common'
import { User } from '../../users/entities/user.entity'

@Injectable()
export class Pagination {
  private static getSkip(options: PageOptionsDto): number {
    return options.page * options.take
  }

  static pageQueryBuilder(
    queryBuilder: SelectQueryBuilder<any>,
    options: PageOptionsDto,
  ): SelectQueryBuilder<any> {
    return queryBuilder.skip(this.getSkip(options)).take(options.take)
  }

  static pageQuery(query: String, options: PageOptionsDto): string {
    return `${query} LIMIT ${options.take} OFFSET ${this.getSkip(options)}`
  }
}
