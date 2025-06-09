// src/config/jwt.config.ts
export const JwtConfig = {
  SECRET_KEY: process.env.JWT_SECRET_KEY || 'my_secret',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  PRIVATE_KEY_PATH: process.env.JWT_PRIVATE_KEY_PATH || './src/config/jwt keys/private_key.pem',
  PUBLIC_KEY_PATH: process.env.JWT_PUBLIC_KEY_PATH || './src/config/jwt keys/public_key.pem',
};
