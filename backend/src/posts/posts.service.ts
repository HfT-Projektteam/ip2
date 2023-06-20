import { Inject, Injectable, Scope } from '@nestjs/common'
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
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.creator', 'creator'),
      pageOpt,
    )

    const filteredQuery = addFilterToQuery(query, filterQueryParams)

    return filteredQuery.getManyAndCount().then((res) => {
      return new Page(res[0], res[1], pageOpt)
    })
  }

  findOne(id: string) {
    return this.postRepo.findOneByOrFail({ uuid: id })
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    // TODO can only do if post creator
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

  remove(id: string) {
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
      if (e.detail.includes('already exists')) return false
    }

    this.postRepo
      .createQueryBuilder('post')
      .update(Post)
      .where('uuid = :uuid', { uuid: id })
      .set({ likes: () => 'likes + 1' })
      .execute()
      .then(() => {
        return true
      })
  }

  dislike(id: string) {}
}
