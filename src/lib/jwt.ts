import jwt from "jsonwebtoken";

import { config } from "../config/index.js";
import type { UserId, UserRole } from "../database/schema.js";

export interface TokenPayload {
  userId: UserId;
  role: UserRole;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.auth.jwtSecret, { expiresIn: config.auth.jwtAccessExp });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.auth.jwtSecret, { expiresIn: config.auth.jwtRefreshExp });
}
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, config.auth.jwtSecret) as TokenPayload;
}
