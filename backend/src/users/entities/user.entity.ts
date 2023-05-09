import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class User {
  @ApiProperty({
    description: 'The URI of a spotify user, which used this service',
  })
  @PrimaryColumn()
  spotify_uri: string;

  @ApiProperty({type: () => [User]})
  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_following_user',
    joinColumn: { name: 'follower' },
    inverseJoinColumn: { name: 'following' },
  })
  following: User[];
}
