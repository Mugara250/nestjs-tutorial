import { Injectable } from '@nestjs/common';
import fsp from 'node:fs/promises';
import { z } from 'zod';

const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  active: z.boolean(),
  photo: z.string(),
  password: z.string(),
});

type UserDTO = z.infer<typeof UserSchema>;

@Injectable()
export class UsersService {
  private users: UserDTO[] = [];

  constructor() {
    void this.loadUsers();
  }
  private async loadUsers() {
    try {
      const data = await fsp.readFile(
        `${process.cwd()}/dev-data/data/users.json`,
        'utf8',
      );
      this.users = z.array(UserSchema).parse(JSON.parse(data));
    } catch (error) {
      console.log(error);
    }
  }

  getUsers() {
    return this.users;
  }
}
