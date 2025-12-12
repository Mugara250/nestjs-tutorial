import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  welcomeUser(): string {
    return 'Welcome to the Tours API!';
  }
}
