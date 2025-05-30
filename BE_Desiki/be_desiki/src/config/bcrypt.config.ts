// src/config/jwt.config.ts
export const BcryptConfig = {
    SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
};
