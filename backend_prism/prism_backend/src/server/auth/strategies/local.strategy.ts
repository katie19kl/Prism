
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '..//auth.service';
import { LoginUserDto } from 'src/server/users/dto/login-user.dto';
import { CreateUserDto } from 'src/server/users/dto/create-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(createUserDto: CreateUserDto): Promise<any> {


    const user = await this.authService.validateUserByPassword(createUserDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
