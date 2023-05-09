import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { CircularDependencyException } from '@nestjs/core/errors/exceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.spotify_uri = createUserDto.spotify_uri;

    return this.userRepo.save(user);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepo, {
      sortableColumns: ['spotify_uri'],
      relativePath: true,
      select: ['spotify_uri'],
    });
  }

  async findOne(spotify_uri: string): Promise<User> {
    return await this.userRepo.findOneByOrFail({ spotify_uri: spotify_uri });
  }

  async remove(spotify_uri: string) {
    return this.userRepo.delete({ spotify_uri: spotify_uri });
  }

  async followUser(
    follower_uri: string,
    to_be_followed_uri: string,
  ): Promise<User> {
    if (follower_uri === to_be_followed_uri)
      throw new CircularDependencyException('User can not follow itself.');
    //throw new Error('User can not follow itself.');

    let follower = await this.userRepo.findOneOrFail({
      where: { spotify_uri: follower_uri },
      relations: ['following'],
    });
    const to_be_followed = await this.findOne(to_be_followed_uri);
    follower.following.push(to_be_followed);

    return this.userRepo.save(follower);
  }

  //Who the user is following
  async getFollowings(
    spotify_uri: string,
    query: PaginateQuery,
  ): Promise<Paginated<User>> {
    return paginate(query, this.userRepo, {
      sortableColumns: ['spotify_uri'],
      relativePath: true,
      relations: ['following'],
      where: { spotify_uri: spotify_uri },
    });
  }

  //Who is following the user
  // async getFollowers(
  //   spotify_uri: string,
  //   query: PaginateQuery,
  // ): Promise<Paginated<User>> {
  //   const queryBuilder = this.userRepo
  //     .createQueryBuilder()
  //     .from(User, 'user_following_user');
  // }
}
