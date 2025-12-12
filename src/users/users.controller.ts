import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post()
  createUser(
    @Body()
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      active: boolean;
      photo: string;
      password: string;
    },
  ) {
    return this.usersService.createUser(user);
  }
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }
}
