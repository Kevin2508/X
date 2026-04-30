import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
export const signup = async (req: Request, res: Response) => {
  try {
    const {
      display_name,
      user_name,
      email,
      password,
      captcha,
    } = req.body;
    console.log(display_name);
    const hashed_password = bcrypt.hashSync(password, 8);
    console.log(hashed_password);

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO users (display_name, user_name, email, password) VALUES (?, ?, ?, ?)`,
      [
        display_name,
        user_name,
        email,
        hashed_password,
       
      ],
    );

    res.status(201).json({
      id: result.insertId,
      user: { user_name, email },
      message: "user created successfully",
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({
        message: "Invalid Input Data",
      });
    }
    const [rows] = await db.query<RowDataPacket[]>(
      `select * from users where user_name = ? or email = ?`,
      [identifier, identifier],
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const payload: JwtPayload = {
      id: user.user_id,
      user_name: user.user_name,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      algorithm: "HS256",
      expiresIn: 86400,
    });
    if (token) {
      return res.status(200).json({
        token: token,
        message: "signin success",
      });
    }
  } catch (error) {
    console.log(`Error occured while signing up :\n${error}`);
  }
};
