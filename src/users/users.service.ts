import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import fsp from 'node:fs/promises';
import { z, ZodError } from 'zod';

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

  getUser(id: string) {
    const user = this.users.find(({ _id }) => _id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist!`);
    }
    return user;
  }

  createUser(user: UserDTO) {
    if (this.users.find(({ _id }) => _id === user._id)) {
      throw new ConflictException(`User with id ${user._id} already exists!`);
    }
    try {
      UserSchema.parse(user);
      this.users.push(user);
      return user;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(JSON.parse(error.message));
      } else {
        throw new BadRequestException(`Invalid inputs!`);
      }
    }
  }
}
