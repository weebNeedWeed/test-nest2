import {
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { Test } from "@nestjs/testing";
import * as bcrypt from "bcrypt";

describe("UserRepository", () => {
  let userRepository;

  // MockData

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe("signUp", () => {
    let mockUserData, mockSalt, save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
      mockUserData = { username: "test", password: "test" };
      userRepository.hashPassword = jest.fn().mockResolvedValue("hashed");
    });

    it("should create new user instance", async () => {
      bcrypt.genSalt = jest.fn().mockResolvedValue(mockSalt);
      await userRepository.signUp(mockUserData);

      expect(userRepository.create).toHaveBeenCalledWith({
        ...mockUserData,
        password: "hashed",
        salt: mockSalt,
      });
    });

    it("successfully signup a new user", () => {
      save.mockResolvedValue(null);
      expect(userRepository.signUp(mockUserData)).resolves.not.toThrow();
    });

    it("should throw an error when failed", async () => {
      save.mockRejectedValue();
      expect(userRepository.signUp(mockUserData)).rejects.toThrow();
    });

    it("should throw UnauthorizedException when username had been used", () => {
      save.mockRejectedValue({ code: "23505" });
      expect(userRepository.signUp(mockUserData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should throw InternalServerErrorException when received different code", () => {
      save.mockRejectedValue({ code: "3213" });
      expect(userRepository.signUp(mockUserData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("hashPassword", () => {
    it("should return a hash string", async () => {
      const hashFn = jest.fn().mockReturnValue("hashed");
      bcrypt.hash = hashFn;

      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await userRepository.hashPassword(
        "testUsername",
        "testPassword",
      );
      expect(result).toEqual("hashed");
      expect(bcrypt.hash).toHaveBeenCalledWith("testUsername", "testPassword");
    });
  });

  describe("validateUserPassword", () => {
    let findFn, validate;
    const mockUserData = { username: "test", password: "test" };

    beforeEach(() => {
      validate = jest.fn();
      findFn = jest
        .fn()
        .mockResolvedValue({ ...mockUserData, validatePassword: validate });
      userRepository.findOne = findFn;
    });

    it("should return username when user is found and validated", () => {
      validate.mockResolvedValue(true);
      const result = userRepository.validateUserPassword(mockUserData);
      expect(result).resolves.toEqual(mockUserData.username);
    });

    it("should return undefined when user is not found", () => {
      findFn.mockResolvedValue(undefined);
      const result = userRepository.validateUserPassword(mockUserData);
      expect(result).resolves.toEqual(undefined);
    });

    it("should return undefined when password is not validated", () => {
      validate.mockResolvedValue(undefined);
      const result = userRepository.validateUserPassword(mockUserData);
      expect(result).resolves.toEqual(undefined);
    });
  });
});
