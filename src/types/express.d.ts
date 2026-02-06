import type { TokenPayload } from "../lib/jwt.ts";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
