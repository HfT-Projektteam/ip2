import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { CreatePostDto } from '../dto/create-post.dto'
@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column()
  songId: string

  @Column()
  description: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  uploaded: Date

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  creator: User

  // @ManyToMany(() => Post)
  // liker: User[]
  @Column({ default: 0 })
  likes: number

  // @ManyToMany(() => Post)
  // disliker: User[]
  @Column({ default: 0 })
  dislikes: number

  @Column()
  genre: string

  constructor(dto: CreatePostDto, poster: User) {
    this.songId = dto?.song_id
    this.description = dto?.description
    this.genre = dto?.genre
    this.creator = poster
  }
}
