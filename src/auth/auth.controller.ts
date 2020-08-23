import { UserCredentialsDto } from "./dto/userCredentials.dto";
import { AuthService } from "./auth.service";
import { Controller, Post, Body, ValidationPipe } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signUp(
    @Body(ValidationPipe) userCredentialsDto: UserCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(userCredentialsDto);
  }

  @Post("/signin")
  signIn(
    @Body(ValidationPipe) userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessKey: string }> {
    return this.authService.signIn(userCredentialsDto);
  }
}
