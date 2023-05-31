import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class PageMeta {
  constructor(totalEntries, options: PageOptionsDto) {
    this.pageSize = options.take
    this.itemCount = totalEntries
    this.page = options.page
  }

  @ApiProperty()
  self: string
  @ApiProperty()
  next: string
  @ApiProperty()
  pageSize: number
  @ApiPropertyOptional()
  page: number
  @ApiProperty()
  itemCount: number
}

export class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly page?: number = 0

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10

  get skip(): number {
    return (this.page - 1) * this.take
  }
}

export class Page<T> {
  constructor(data: T[], totalEntries: number, options: PageOptionsDto) {
    this.data = data
    this.meta = new PageMeta(totalEntries, options)
  }

  @ApiProperty({
    description: 'The results of the Service',
  })
  data: T[]
  @ApiProperty()
  meta: PageMeta
}
