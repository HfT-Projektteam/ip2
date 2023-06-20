import { ApiProperty } from '@nestjs/swagger'

export class CreatePostDto {
  @ApiProperty()
  song_id: string
  @ApiProperty()
  description: string
  @ApiProperty()
  genre: string
}
