import { NextFunction, Request,Response } from "express"
import db from "../config/database";
import { User } from "../types";

export const checkDuplicateSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_name = req.body.user_name;
    console.log(user_name);
    const [user] = await db.query<User[]>(`select * from users where user_name = ?`,[user_name]);
    console.log('From Middleware: ',user)
    if(user.length > 0){
      return res.status(404).json({
        accessToken: null,
        message:'User Already exist',
      })
    }
    next();
  } catch (error) {
    console.error(error);
  }
};