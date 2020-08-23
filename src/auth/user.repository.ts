import * as bcrypt from "bcrypt";
import { EntityRepository, Repository } from "typeorm";
import { UserCredentialsDto } from "./dto/userCredentials.dto";
import { User } from "./user.entity";
import {
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userCredentialsDto: UserCredentialsDto): Promise<void> {
    const { username, password } = userCredentialsDto;

    const salt: string = await bcrypt.genSalt(10);
    const newUser = this.create({
      username,
      password: await this.hashPassword(password, salt),
      salt: salt,
    });

    try {
      await newUser.save();
    } catch (error) {
      const { code } = error;

      if (code === "23505") {
        throw new UnauthorizedException("Invalid credentials");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<string> {
    const { username, password } = userCredentialsDto;

    const found = await this.findOne({ username });
    if (found && (await found.validatePassword(password))) {
      return found.username;
    } else {
      return undefined;
    }
  }
}
