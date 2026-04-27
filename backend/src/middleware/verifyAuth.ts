import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { User,JwtPayload } from "../types";
import db from "../config/database";

interface AuthenticatedRequest extends Request {
  
  user?: User;
}

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  let token = req.headers["authorization"];
  if (!token || typeof token !== "string") {
    res.status(403).json({
      message: "No tokens provided",
    });
    return;
  }
  if (token?.startsWith("Bearer ")) {
    token = token.slice(7);
  }
  try {
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    const [user] = await db.query<User[]>(
      `select * from users where user_id = ?`,
      [decode.id],
    );
    console.log(user);
    if (user.length === 0) {
      return res.status(400).json({ message: "No user data found" });
    }
    req.user = user[0];
    next();
  } catch (error) {
    console.log(`Error while fetching user:\n\n${error}`);
  }
};
