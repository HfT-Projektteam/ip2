import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { CircularFollowerExceptionFilter } from '../filters/circular-follower-exception/circular-follower-exception.filter'
import { APP_FILTER } from '@nestjs/core'
import { AuthService } from '../auth/auth.service'
import { HttpService } from '@nestjs/axios'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_FILTER,
      useClass: CircularFollowerExceptionFilter,
    },
  ],
})
export class UsersModule {}
