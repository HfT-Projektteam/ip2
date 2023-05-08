import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  spotify_uri: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_following_user',
    joinColumn: { name: 'follower' },
    inverseJoinColumn: { name: 'following' },
  })
  following: User[];
}
