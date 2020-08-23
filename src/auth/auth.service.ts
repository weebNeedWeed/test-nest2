import { JwtPayload } from "./jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { UserCredentialsDto } from "./dto/userCredentials.dto";
import { UserRepository } from "./user.repository";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(userCredentialsDto: UserCredentialsDto): Promise<void> {
    return this.userRepository.signUp(userCredentialsDto);
  }

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessKey: string }> {
    const username = await this.userRepository.validateUserPassword(
      userCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException("Invalid Credentials");
    }

    const payload: JwtPayload = { username };
    const accessKey = this.jwtService.sign(payload);

    return { accessKey };
  }
}
