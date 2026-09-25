export interface OTPConfig {
  length: number;
  expiryMinutes: number;
  maxAttempts: number;
  cooldownMinutes: number;
}

export interface OTPResult {
  success: boolean;
  message: string;
  cooldownUntil?: Date;
  attemptsLeft?: number;
}

export interface OTPVerificationResult extends OTPResult {
  isValid?: boolean;
}

export const DEFAULT_CONFIG: OTPConfig = {
  length: 6,
  expiryMinutes: 10,
  maxAttempts: 3,
  cooldownMinutes: 15,
};
