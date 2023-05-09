import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CircularDependencyException } from '@nestjs/core/errors/exceptions';
import { Response } from 'express';

@Catch(CircularDependencyException)
export class CircularFollowerExceptionFilter implements ExceptionFilter {
  catch(exception: CircularDependencyException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception.message);
    return response.status(400).json({
      message: {
        statusCode: 400,
        error: 'Circular Follower Exception',
        message: "A user can't follow himself, that just makes no sense",
      },
    });
  }
}
