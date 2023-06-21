import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { REQUEST } from '@nestjs/core'
import { Post } from './entities/post.entity'
import { Page, PageOptionsDto } from '../util/pagination/page.dto'
import { Pagination } from '../util/pagination/pagination'
import { PostFilterQuery } from './entities/post-query.entity'
import { addFilterToQuery } from './posts.util'
import { User } from '../users/entities/user.entity'
import { Request } from 'express'

@Injectable({ scope: Scope.REQUEST })
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}
  async create(createPostDto: CreatePostDto): Promise<Post> {
    return this.postRepo.save(
      new Post(createPostDto, this.request['spotify_uri']),
    )
  }

  async findAll(pageOpt: PageOptionsDto, filterQueryParams: PostFilterQuery) {
    const query = Pagination.pageQueryBuilder(
      this.postRepo
        .createQueryBuilder('posts')
        .leftJoinAndSelect('posts.creator', 'creator'),
      pageOpt,
    )

    const filteredQuery = addFilterToQuery(query, filterQueryParams)

    return filteredQuery.getManyAndCount().then((res) => {
      return new Page(res[0], res[1], pageOpt)
    })
  }

  async findAllFollowerFeed(
    pageOpt: PageOptionsDto,
    filterQueryParams: PostFilterQuery,
  ) {
    // const query = await this.userRepo
    //   .createQueryBuilder('user')
    //   .where('user.spotify_uri = :id', { id: this.request['spotify_uri'] })
    //   .leftJoinAndSelect('user.following', 'following')
    //   .leftJoinAndSelect('following.posts', 'posts')
    //   .leftJoinAndSelect('posts.creator', 'creator')
    // .select('posts.*')

    const followings: string[] = await this.userRepo
      .createQueryBuilder('user')
      .where('user.spotify_uri = :id', { id: this.request['spotify_uri'] })
      .leftJoinAndSelect('user.following', 'following')
      .select('following.*')
      .getRawMany()
      .then((res) => {
        return res.map((user) => {
          return user.spotify_uri
        })
      })
    followings.push(this.request['spotify_uri'])

    const postQuery = Pagination.pageQueryBuilder(
      this.postRepo
        .createQueryBuilder('posts')
        .leftJoinAndSelect('posts.creator', 'creator')
        .where('posts.creator IN (:...followings)', {
          followings: followings,
        }),
      pageOpt,
    )

    const filteredQuery = addFilterToQuery(postQuery, filterQueryParams)

    return filteredQuery.getManyAndCount().then((res) => {
      return new Page(res[0], res[1], pageOpt)
    })
  }

  getPostsByUser(user_id: string, pageOptionsDto: PageOptionsDto) {
    const pageQuery = Pagination.pageQueryBuilder(
      this.postRepo
        .createQueryBuilder('posts')
        .where('posts.creator = :user_id', { user_id: user_id }),
      pageOptionsDto,
    )

    return pageQuery.getManyAndCount().then((res) => {
      return new Page(res[0], res[1], pageOptionsDto)
    })
  }

  findOne(id: string) {
    return this.postRepo.findOneByOrFail({ uuid: id })
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.postRepo
      .findOneOrFail({ where: { uuid: id }, relations: { creator: true } })
      .then((post) => {
        if (this.request['spotify_uri'] != post.creator.spotify_uri)
          throw new UnauthorizedException('Only post creators can edit them')
      })

    return this.postRepo
      .createQueryBuilder('post')
      .update(Post)
      .set(updatePostDto)
      .where('uuid = :id', { id: id })
      .execute()
      .then((result) => {
        return result.affected == 1
      })
  }

  async remove(id: string) {
    await this.postRepo
      .findOneOrFail({ where: { uuid: id }, relations: { creator: true } })
      .then((post) => {
        if (this.request['spotify_uri'] != post.creator.spotify_uri)
          throw new UnauthorizedException('Only post creators can edit them')
      })

    return this.postRepo.delete({ uuid: id })
  }

  async like(id: string) {
    try {
      await this.userRepo
        .createQueryBuilder('user')
        .relation(User, 'likes')
        .of(this.request['spotify_uri'])
        .add(id)
    } catch (e) {
      if (e.detail.includes('already exists')) {
        //Case: User already liked
        await this.userRepo
          .createQueryBuilder('user')
          .relation(User, 'likes')
          .of(this.request['spotify_uri'])
          .remove(id)
        return this.postRepo
          .createQueryBuilder('post')
          .update(Post)
          .where('uuid = :uuid', { uuid: id })
          .set({ likes: () => 'likes - 1' })
          .execute()
          .then(() => {
            return false
          })
      }
      console.log(e)
      return false
    }

    return this.postRepo
      .createQueryBuilder('post')
      .update(Post)
      .where('uuid = :uuid', { uuid: id })
      .set({ likes: () => 'likes + 1' })
      .execute()
      .then(() => {
        return true
      })
  }

  async dislike(id: string) {
    try {
      await this.userRepo
        .createQueryBuilder('user')
        .relation(User, 'dislikes')
        .of(this.request['spotify_uri'])
        .add(id)
    } catch (e) {
      if (e.detail.includes('already exists')) {
        //Case: User already disliked
        await this.userRepo
          .createQueryBuilder('user')
          .relation(User, 'dislikes')
          .of(this.request['spotify_uri'])
          .remove(id)
        return this.postRepo
          .createQueryBuilder('post')
          .update(Post)
          .where('uuid = :uuid', { uuid: id })
          .set({ dislikes: () => 'dislikes - 1' })
          .execute()
          .then(() => {
            return false
          })
      }
    }

    return this.postRepo
      .createQueryBuilder('post')
      .update(Post)
      .where('uuid = :uuid', { uuid: id })
      .set({ likes: () => 'dislikes + 1' })
      .execute()
      .then(() => {
        return true
      })
  }

  getLike(id: string): Promise<boolean> {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.spotify_uri = :uri', { uri: this.request['spotify_uri'] })
      .leftJoinAndSelect('user.likes', 'likes')
      .where('likes.uuid = :uuid', { uuid: id })
      .getMany()
      .then((result) => {
        return result.length > 0
      })
      .catch((e) => {
        console.log(e)
        return false
      })
  }

  getDislike(id: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.spotify_uri = :uri', { uri: this.request['spotify_uri'] })
      .leftJoinAndSelect('user.dislikes', 'dislikes')
      .where('dislikes.uuid = :uuid', { uuid: id })
      .getMany()
      .then((result) => {
        return result.length > 0
      })
      .catch((e) => {
        console.log(e)
        return false
      })
  }

  getTop5Genre(): Promise<string[]> {
    return this.postRepo
      .query(
        'Select genre FROM post GROUP BY genre ORDER BY Count(genre) DESC LIMIT 5',
      )
      .then((result) => {
        return result.map((genre) => {
          return genre.genre
        })
      })
  }
}
