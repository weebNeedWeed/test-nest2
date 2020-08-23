import { IsNotEmpty, Matches, MinLength, MaxLength } from "class-validator";

export class UserCredentialsDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/)
  password: string;
}
