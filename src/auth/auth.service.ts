import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException(`Invalid email or password`);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
