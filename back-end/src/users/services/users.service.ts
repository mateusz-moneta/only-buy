import { Injectable } from '@nestjs/common';

import { RegisterUserDto } from '../dto';
import { UserEntity } from '../entities';

@Injectable()
export class UsersService {
  async register(registerUserDto: RegisterUserDto): Promise<boolean> {
    const user = new UserEntity(registerUserDto);

    return !!(await user.save());
  }
}
