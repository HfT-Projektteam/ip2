import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column()
  description: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  uploaded: Date

  @ManyToOne(() => User, (user) => user.posts)
  creator: User

  // @ManyToMany(() => Post)
  // liker: User[]
  @Column()
  likes: number

  // @ManyToMany(() => Post)
  // disliker: User[]
  @Column()
  dislikes: number
}
