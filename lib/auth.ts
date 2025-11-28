import jwt from "jsonwebtoken";

export function verifyToken(req: Request) {
  const header = req.headers.get("authorization");
  if (!header) return null;

  const token = header.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return null;
  }
}
