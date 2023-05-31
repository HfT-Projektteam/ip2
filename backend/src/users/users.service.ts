import { Injectable } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CircularDependencyException } from '@nestjs/core/errors/exceptions'
import { Page, PageOptionsDto } from '../util/pagination/page.dto'
import { Pagination } from '../util/pagination/pagination'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: UserDto): Promise<User> {
    const user = new User()
    user.spotify_uri = createUserDto.spotify_uri

    return this.userRepo.save(user)
  }

  async findAll(pageOpt: PageOptionsDto) {
    const query = Pagination.pageQueryBuilder(
      this.userRepo.createQueryBuilder(),
      pageOpt,
    )
    console.log('Query:' + query.getQuery())

    return query.getManyAndCount().then((res) => {
      return new Page(res[0], res[1], 'temp', pageOpt)
    })
  }

  async findOne(spotify_uri: string): Promise<User> {
    return await this.userRepo.findOneByOrFail({ spotify_uri: spotify_uri })
  }

  async remove(spotify_uri: string) {
    return this.userRepo.delete({ spotify_uri: spotify_uri })
  }

  async followUser(
    to_be_followed_uri: string,
    follower_uri: string,
  ): Promise<User> {
    if (follower_uri === to_be_followed_uri)
      throw new CircularDependencyException('User can not follow itself.')
    //throw new Error('User can not follow itself.');

    let to_be_followed = await this.userRepo.findOneOrFail({
      where: { spotify_uri: to_be_followed_uri },
      relations: ['following'],
    })

    if (await this.doesUser1FollowUser2(to_be_followed_uri, follower_uri))
      return to_be_followed

    const follower = await this.findOne(follower_uri)
    to_be_followed.following.push(follower)

    return this.userRepo.save(to_be_followed)
  }

  async doesUser1FollowUser2(
    follower_uri1: string,
    follower_uri2: string,
  ): Promise<boolean> {
    return this.userRepo
      .exist({
        where: {
          spotify_uri: follower_uri1,
          following: { spotify_uri: follower_uri2 },
        },
        relations: ['following'],
      })
      .then((isFollowing) => {
        return isFollowing
      })
  }

  //Who the user is following
  async getFollowings(
    spotify_uri: string,
    pageOpt: PageOptionsDto,
  ): Promise<[User]> {
    // Somehow this query is not accepted by paginate (Crashes the service)
    const queryBuilder = this.userRepo
      .createQueryBuilder('users')
      .select(['following.spotify_uri', 'users.spotify_uri'])
      .where('users.spotify_uri = :uri', { uri: spotify_uri })
      .leftJoinAndSelect('users.following', 'following')
    // console.log(await queryBuilder1);
    // console.log(await queryBuilder.getMany());
    // .getRawMany();

    // return paginate(query, this.userRepo, {
    //   sortableColumns: ['spotify_uri'],
    //   relativePath: true,
    //   relations: ['following'],
    //   where: { spotify_uri: spotify_uri },
    // });

    const query = this.userRepo.query(
      Pagination.pageQuery(
        'SELECT following FROM user_following_user',
        pageOpt,
      ),
    )

    return query.then((result) => {
      return result.map((user) => {
        return new User(user.following)
      })
    })
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
