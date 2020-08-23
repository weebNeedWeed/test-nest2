import { UnauthorizedException } from "@nestjs/common";
import { User } from "./user.entity";
import { JwtPayload } from "./../../dist/auth/jwt-payload.interface.d";
import { JwtStrategy } from "./jwt.strategy";
import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
describe("JwtStrategy", () => {
  const mockUserRepository = () => ({
    findOne: jest.fn(),
  });

  let jwtStrategy, userRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe("validate", () => {
    const payload: JwtPayload = { username: "test" };

    it("should return user data when payload is valid", () => {
      const user = new User();
      user.username = "username";
      userRepository.findOne.mockResolvedValue(user);

      const result = jwtStrategy.validate(payload);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: payload.username,
      });
      expect(result).resolves.toEqual(user);
    });

    it("should throw an UnauthorizedException when payload is invalid", () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = jwtStrategy.validate(payload);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: payload.username,
      });
      expect(result).rejects.toThrow(UnauthorizedException);
    });
  });
});
