import { Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { User } from './users/entities/user.entity'
import { UsersService } from './users/users.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private userService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Post('signIn')
  signIn(): Promise<User> {
    return this.userService.signIn()
  }
}
