import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Post } from '../../posts/entities/post.entity'

@Entity()
export class User {
  @ApiProperty({
    description: 'The URI of a spotify user, which used this service',
  })
  @PrimaryColumn()
  spotify_uri: string

  @ApiProperty({ type: () => [User] })
  @ManyToMany((type) => User, (user: User) => user.spotify_uri)
  @JoinTable({
    name: 'user_following_user',
    joinColumn: { name: 'follower' },
    inverseJoinColumn: { name: 'following' },
  })
  following: User[]

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[]
  constructor(spotify_uri?: string) {
    this.spotify_uri = spotify_uri
  }

  @ManyToMany(() => Post)
  @JoinTable()
  likes: Post[]

  @ManyToMany(() => Post)
  @JoinTable()
  dislikes: Post[]
}
