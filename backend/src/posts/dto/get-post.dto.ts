import { UserDto } from '../../users/dto/user.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Post } from '../entities/post.entity'

export class GetPostDto {
  constructor(post: Post) {
    this.songId = post.songId
    this.description = post.description
    this.genre = post.genre
    this.creator = post.creator
    this.uuid = post.uuid
    this.uploaded = post.uploaded
    this.likes = post.likes
    this.dislikes = post.dislikes
  }

  @ApiProperty()
  songId: string
  @ApiProperty()
  description: string
  @ApiProperty()
  genre: string
  @ApiProperty()
  creator: UserDto
  @ApiProperty()
  uuid: string
  @ApiProperty({
    description: 'Time uploaded in ISO 8601',
    example: '2023-06-19T17:42:46.358Z',
  })
  uploaded: Date
  @ApiProperty()
  likes: number
  @ApiProperty()
  dislikes: number
}
