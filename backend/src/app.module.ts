import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { UsersService } from './users/users.service'
import { UsersController } from './users/users.controller'
import { AuthModule } from './auth/auth.module'
import { AuthGuard } from './auth/auth.guard'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import configOptions from './config/config'
import { PostsModule } from './posts/posts.module'
import { Post } from './posts/entities/post.entity'
import { User } from './users/entities/user.entity'

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      entities: [User, Post],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
