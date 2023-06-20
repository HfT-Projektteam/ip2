import { ApiProperty } from '@nestjs/swagger'

export class UpdatePostDto {
  @ApiProperty()
  description: string
}
