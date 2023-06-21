import { ApiPropertyOptional } from '@nestjs/swagger'

export enum PostSort {
  likes = 'likes',
  dislikes = 'dislikes',
  newest = 'newest',
  oldest = 'oldest',
}

export class PostFilterQuery {
  @ApiPropertyOptional({
    type: 'string',
    description: 'comma seperated list of genres',
  })
  genre?: string
  @ApiPropertyOptional({
    description: 'comma seperated list of genres',
    enum: PostSort,
  })
  sort?: PostSort

  constructor(genre?: string, followerFeed?: boolean, sort?: PostSort) {
    this.genre = genre
    this.sort = sort
  }
}
