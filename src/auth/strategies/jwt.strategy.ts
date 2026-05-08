import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
secretOrKey: configService.get<string>('JWT_SECRET') ?? (() => { throw new Error('JWT_SECRET is not defined') })(),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByPhone(payload.phone);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token yaroqsiz');
    }
    return user;
  }
}