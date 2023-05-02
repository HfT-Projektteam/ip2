import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.spotify_uri = createUserDto.spotify_uri;

    return await this.userRepo.save(user);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepo, {
      sortableColumns: ['spotify_uri'],
      relativePath: true,
      select: ['spotify_uri'],
    });
  }

  async findOne(spotify_uri: string): Promise<User> {
    return await this.userRepo.findOneBy({ spotify_uri: spotify_uri });
  }

  async remove(spotify_uri: string) {
    return await this.userRepo.delete({ spotify_uri: spotify_uri });
  }
}
