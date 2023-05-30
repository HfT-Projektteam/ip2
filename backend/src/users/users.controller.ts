import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UserDto } from './dto/user.dto'
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate'
import { User } from './entities/user.entity'
import { ApiTags } from '@nestjs/swagger'
import { PageOptionsDto } from '../util/pagination/page.dto'
import { PageMetaInterceptor } from '../util/pagination/pagination.interceptor'

@ApiTags('user')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @UseInterceptors(PageMetaInterceptor)
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.findAll(pageOptionsDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @Post('/:id/follower/:following_id')
  follow(@Param('id') id: string, @Param('following_id') following_id: string) {
    return this.usersService.followUser(id, following_id)
  }

  @Get('/:id/follower/:following_id')
  getIfFollow(
    @Param('id') id: string,
    @Param('following_id') following_id: string,
  ) {
    return this.usersService
      .doesUser1FollowUser2(id, following_id)
      .then((bool) => {
        return {
          doesUserFollowUser: bool,
        }
      })
  }

  @Get('/:id/followings/')
  @UseInterceptors(PageMetaInterceptor)
  getFollowings(
    @Param('id') id: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<[User]> {
    return this.usersService.getFollowings(id, pageOptionsDto)
  }
}
