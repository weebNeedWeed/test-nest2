export const jwtSecret = "Key2004";

export const jwtConfig = {
  secret: jwtSecret,
  signOptions: {
    expiresIn: 3600,
  },
};
