import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET ?? 'change-me-too',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string; role: string }) {
    // Re-extract the raw token so the service can look up its hash in the
    // database and check whether it's been revoked (passport only verifies
    // the JWT signature/expiry, not our own revocation list).
    const rawToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string;
    return { userId: payload.sub, email: payload.email, role: payload.role, refreshToken: rawToken };
  }
}
