import { Inject, Injectable, Scope } from '@nestjs/common'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CircularDependencyException } from '@nestjs/core/errors/exceptions'
import { Page, PageOptionsDto } from '../util/pagination/page.dto'
import { UserDto } from './dto/user.dto'
import { Pagination } from '../util/pagination/pagination'
import { REQUEST } from '@nestjs/core'
import { PostFilterQuery } from '../posts/entities/post-query.entity'

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}
  async signIn() {
    return this.create({
      spotify_uri: this.request['spotify_uri'],
    })
  }

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

    return query.getManyAndCount().then((res) => {
      return new Page(res[0], res[1], pageOpt)
    })
  }

  async searchMany(nameQuery: string, pageOpt: PageOptionsDto) {
    const query = Pagination.pageQueryBuilder(
      this.userRepo
        .createQueryBuilder('users')
        .where('users.spotify_uri like :uri', { uri: `%${nameQuery}%` }),
      pageOpt,
    )

    return query.getManyAndCount().then((res) => {
      return new Page(res[0], res[1], pageOpt)
    })
  }

  async findOne(spotify_uri: string): Promise<User> {
    return this.userRepo.findOneByOrFail({ spotify_uri: spotify_uri })
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
  ): Promise<Page<User>> {
    // Somehow this query is not accepted by paginate (Crashes the service)
    // const queryBuilder = this.userRepo
    //   .createQueryBuilder('users')
    //   .select(['following.spotify_uri', 'users.spotify_uri'])
    //   .where('users.spotify_uri = :uri', { uri: spotify_uri })
    //   .leftJoinAndSelect('users.following', 'following')
    // console.log(await queryBuilder1);
    // console.log(await queryBuilder.getMany());
    // .getRawMany();

    // return paginate(query, this.userRepo, {
    //   sortableColumns: ['spotify_uri'],
    //   relativePath: true,
    //   relations: ['following'],
    //   where: { spotify_uri: spotify_uri },
    // });
    const users = this.userRepo
      .query(
        Pagination.pageQuery(
          'SELECT following FROM user_following_user WHERE follower = $1',
          pageOpt,
        ),
        [spotify_uri],
      )
      .then((result) => {
        return result.map((user) => {
          return new User(user.following)
        })
      })

    const totalUsers = this.userRepo.query(
      'SELECT Count(following) FROM user_following_user WHERE follower = $1',
      [spotify_uri],
    )
    return Promise.all([users, totalUsers]).then((results) => {
      return new Page(results[0], results[1][0].count, pageOpt)
    })
  }

  // Who is following the user
  async getFollowers(
    spotify_uri: string,
    pageOpt: PageOptionsDto,
  ): Promise<Page<User>> {
    const users = this.userRepo
      .query(
        Pagination.pageQuery(
          'SELECT follower FROM user_following_user WHERE following = $1',
          pageOpt,
        ),
        [spotify_uri],
      )
      .then((result) => {
        return result.map((user) => {
          return new User(user.follower)
        })
      })

    const totalUsers = this.userRepo.query(
      'SELECT Count(follower) FROM user_following_user WHERE following = $1',
      [spotify_uri],
    )
    return Promise.all([users, totalUsers]).then((results) => {
      return new Page(results[0], results[1][0].count, pageOpt)
    })
  }
}
