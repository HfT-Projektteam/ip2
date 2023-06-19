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
import { PostQuery } from './entities/post-query.entity'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('posts')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto)
  }

  @Get()
  findAll(@Query() query: PostQuery) {
    return this.postsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id)
  }

  // Maybe to update comment description
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id)
  }

  //Likes
  @Put(':id/like')
  like(@Param('id') id: string) {
    // TODO Hier auch entscheiden, ob like hinzugefügt wird oder nicht
  }
  @Put(':id/dislike')
  dislike(@Param('id') id: string) {
    // TODO Hier auch entscheiden, ob like hinzugefügt wird oder nicht
  }
}
