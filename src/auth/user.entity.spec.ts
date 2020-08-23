import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

describe("UserEntity", () => {
  let user;
  beforeEach(() => {
    user = new User();
    user.password = "match";
    user.salt = "test";
    bcrypt.hash = jest.fn();
  });

  describe("validatePassword", () => {
    it("should return true when password is valid", async () => {
      bcrypt.hash.mockResolvedValue("match");
      const result = await user.validatePassword(user.password);

      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, user.salt);
      expect(result).toEqual(true);
    });

    it("should return false when password is invalid", async () => {
      bcrypt.hash.mockResolvedValue("not_match");
      const result = await user.validatePassword(user.password);

      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, user.salt);
      expect(result).toEqual(false);
    });
  });
});
