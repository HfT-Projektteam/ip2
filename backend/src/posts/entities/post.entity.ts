import { CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export class Post {
  uuid: string;

  description: string;

  // @CreateDateColumn({
  //   type: 'timestamp',
  //   default: () => 'CURRENT_TIMESTAMP(6)',
  // })
  uploaded: Date;

  public: boolean;

  creator: User;

  liker: User[];
  likes: number;

  disliker: User[];
  dislikes: number;
}
