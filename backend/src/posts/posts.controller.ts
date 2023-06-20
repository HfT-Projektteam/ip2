import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostFilterQuery } from './entities/post-query.entity'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { PageOptionsDto } from '../util/pagination/page.dto'
import { PageMetaInterceptor } from '../util/pagination/pagination.interceptor'

@ApiTags('posts')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //Likes
  @ApiResponse({
    description:
      'Returns true if the post was liked, false if the like was removed',
  })
  @Put(':id/like')
  like(@Param('id') id: string) {
    return this.postsService.like(id)
  }
  @ApiResponse({
    description: 'Returns true if the post is liked by the user, false if not',
  })
  @Get(':id/like')
  getLike(@Param('id') id: string) {
    return this.postsService.getLike(id)
  }
  @ApiResponse({
    description:
      'Returns true if the post was disliked, false if the dislike was removed',
  })
  @Put(':id/dislike')
  dislike(@Param('id') id: string) {
    return this.postsService.dislike(id)
  }
  @ApiResponse({
    description:
      'Returns true if the post is disliked by the user, false if not',
  })
  @Get(':id/dislike')
  getDislike(@Param('id') id: string) {
    return this.postsService.getDislike(id)
  }
  @Get('/genre')
  getTopGenre() {
    return this.postsService.getTop5Genre()
  }

  //CRUD Operations
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto)
  }

  @Get()
  @UseInterceptors(PageMetaInterceptor)
  findAll(@Query() query: PostFilterQuery, @Query() pageOpts: PageOptionsDto) {
    return this.postsService.findAll(pageOpts, query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id)
  }

  // Maybe to update comment description
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id)
  }
}
