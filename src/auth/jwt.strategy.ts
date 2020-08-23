import { JwtPayload } from "./jwt-payload.interface";

import { UserRepository } from "./user.repository";
import { jwtSecret } from "./../config/jwt.config";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;

    const found = await this.userRepository.findOne({ username });

    if (!found) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return found;
  }
}
