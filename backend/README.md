# Backend of the friendify App

We will be Using:
- node.js 18.15.x
- [nestJS](https://docs.nestjs.com)

# Code generation
We could mabe use [this](https://github.com/Ryan-Sin/swagger-nestjs-codegen) openapi.yaml to nestJS code generator.

# Database
We are using TypeORM with Postgres.

Use `yarn db:start` to spin up the database. The data.sql file will be executed on startup. 
To stop and delte the database data e.g. the docker volume, use `yarn db:kill`

## Migrating
TypeORM and their CLI do support it, [see here](https://typeorm.io/migrations#creating-a-new-migration)