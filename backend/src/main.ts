import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception/entity-not-found-exception.filter'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new EntityNotFoundExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Friendify Backend Service')
    .setDescription('')
    .setVersion('1.0')
    .addTag('spotify')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  fs.writeFileSync('./openapi-spec.json', JSON.stringify(document, null, 2))

  await app.listen(3000)
}
bootstrap()
