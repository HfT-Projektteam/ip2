import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Not much to see here though, I`m just a backend anyways';
  }
}
