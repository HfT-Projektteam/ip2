import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    description: 'The URI of a spotify user, which used this service',
  })
  @PrimaryColumn()
  spotify_uri: string;

  @ApiProperty({ type: () => [User] })
  @ManyToMany((type) => User, (user: User) => user.spotify_uri)
  @JoinTable({
    name: 'user_following_user',
    joinColumn: { name: 'follower' },
    inverseJoinColumn: { name: 'following' },
  })
  following: User[];

  constructor(spotify_uri?: string) {
    this.spotify_uri = spotify_uri;
  }
}
