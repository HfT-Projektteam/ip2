import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'The URI of a spotify user, which used this service',
  })
  spotify_uri: string;
}
