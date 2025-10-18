import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest } from "next";

export function verifyToken(req: NextApiRequest): JwtPayload | string | null {
  const token = req.cookies?.token;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}
