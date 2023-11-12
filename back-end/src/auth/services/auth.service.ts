import { Injectable } from '@nestjs/common';

import { RegisterUserDto } from '../dto';
import { UserEntity } from '../entities';

@Injectable()
export class AuthService {
  async register(registerUserDto: RegisterUserDto): Promise<boolean> {
    const user = new UserEntity(registerUserDto);

    return !!user.save();
  }
}
