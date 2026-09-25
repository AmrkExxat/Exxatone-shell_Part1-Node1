import crypto from 'crypto';

import { DEFAULT_CONFIG } from './otp.type';

export const generateSecureOTP = (length: number = DEFAULT_CONFIG.length): string => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }

  return otp;
};

export const verifyHash = (otp: string, salt: string, storedHash: string): boolean => {
  const computed = hashOTP(otp, salt);
  return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(computed, 'hex'));
};

export const createOtpHashString = (otp: string): string => {
  const salt = generateSalt();
  const hash = hashOTP(otp, salt);
  return `${salt}:${hash}`;
};

export const hashOTP = (otp: string, salt: string): string => {
  return crypto.pbkdf2Sync(otp, salt, 10000, 64, 'sha512').toString('hex');
};

export const generateSalt = (): string => {
  return crypto.randomBytes(16).toString('hex');
};
