import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

/* ----------------------------------
   Environment Variables Validation
----------------------------------- */

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`❌ Environment variable ${name} is not defined`);
  }

  return value;
}

const JWT_SECRET = getEnv("JWT_SECRET");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN ?? "30d";

/* ----------------------------------
   Types
----------------------------------- */

export interface JWTPayload {
  _id: string;
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/* ----------------------------------
   Generate JWT Tokens
----------------------------------- */

export function generateTokens(
  payload: Omit<JWTPayload, "iat" | "exp">
): TokenPair {

  const accessTokenOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  const refreshTokenOptions: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, accessTokenOptions);

  const refreshToken = jwt.sign(payload, JWT_SECRET, refreshTokenOptions);

  return { accessToken, refreshToken };
}

/* ----------------------------------
   Verify JWT Token
----------------------------------- */

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/* ----------------------------------
   Password Hashing
----------------------------------- */

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/* ----------------------------------
   Compare Password
----------------------------------- */

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/* ----------------------------------
   Generate Random Token
----------------------------------- */

export function generateRandomToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}