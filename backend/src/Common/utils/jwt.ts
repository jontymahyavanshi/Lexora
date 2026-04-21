import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
}

export const generateToken = (payload: TokenPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};