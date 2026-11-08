// JWT utility functions.
// Secrets are read lazily so that dotenv has always been applied before use.
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_ISSUER = 'zord-api';

const readSecret = (name, devFallback) => {
  const value = process.env[name];

  if (value) return value;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return devFallback;
};

export const generateTokens = (userId, userRole = 'client') => {
  const payload = { userId, role: userRole };
  const accessSecret = readSecret('JWT_SECRET', 'dev_secret');
  const refreshSecret = readSecret('JWT_REFRESH_SECRET', 'dev_refresh');

  const token = jwt.sign(payload, accessSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: JWT_ISSUER,
  });

  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: JWT_ISSUER,
  });

  return { token, refreshToken };
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, readSecret('JWT_SECRET', 'dev_secret'), {
      issuer: JWT_ISSUER,
    });
  } catch {
    throw new Error('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, readSecret('JWT_REFRESH_SECRET', 'dev_refresh'), {
      issuer: JWT_ISSUER,
    });
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};
