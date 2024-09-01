import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    // const user = this.authService.validateUser({ username, password });
    const user = await this.authService.validateUser({
      username,
      password,
    } as LoginDto);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
