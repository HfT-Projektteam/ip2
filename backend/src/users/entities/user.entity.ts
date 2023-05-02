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

  @OneToMany(() => User, (user) => user.followers)
  following: User[];

  @ManyToOne(() => User, (user) => user.following)
  followers: User[];
}
