import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const RESET_TTL_MS = 2 * 60 * 1000;

type PasswordResetSession = {
  userId: number;
  otp: string;
  expiresAt: number;
};

const passwordResetSessions = new Map<string, PasswordResetSession>();

const createAuthToken = (user: RowDataPacket) => {
  const payload: JwtPayload = {
    id: user.user_id,
    user_name: user.user_name,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    algorithm: "HS256",
    expiresIn: 86400,
  });
};

const createOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createResetToken = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

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
    const token = createAuthToken(user);
    if (token) {
      return res.status(200).json({
        token: token,
        user:user,
      });
    }
  } catch (error) {
    console.log(`Error occured while signing up :\n${error}`);
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [rows] = await db.query<RowDataPacket[]>(
      `select * from users where email = ? limit 1`,
      [email],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const resetToken = createResetToken();
    const otp = createOtp();
    const expiresAt = Date.now() + RESET_TTL_MS;

    passwordResetSessions.set(resetToken, {
      userId: rows[0].user_id,
      otp,
      expiresAt,
    });

    return res.status(200).json({
      message: "OTP generated for password reset",
      resetToken,
      otp,
      expiresAt,
      expiresInSeconds: RESET_TTL_MS / 1000,
    });
  } catch (error) {
    console.log(`Error while requesting password reset:\n${error}`);
    return res.status(500).json({ message: "Unable to start password reset" });
  }
};

export const resetPasswordWithOtp = async (req: Request, res: Response) => {
  try {
    const { resetToken, otp, password } = req.body;

    if (!resetToken || !otp || !password) {
      return res.status(400).json({ message: "OTP and new password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const resetSession = passwordResetSessions.get(resetToken);

    if (!resetSession) {
      return res.status(400).json({ message: "Password reset request not found" });
    }

    if (Date.now() > resetSession.expiresAt) {
      passwordResetSessions.delete(resetToken);
      return res.status(410).json({ message: "Password reset request expired" });
    }

    if (resetSession.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    await db.query<ResultSetHeader>(
      `update users set password = ? where user_id = ?`,
      [hashedPassword, resetSession.userId],
    );

    const [rows] = await db.query<RowDataPacket[]>(
      `select * from users where user_id = ? limit 1`,
      [resetSession.userId],
    );

    passwordResetSessions.delete(resetToken);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found after reset" });
    }

    const token = createAuthToken(rows[0]);

    return res.status(200).json({
      message: "Password updated successfully",
      token,
      user: rows[0],
    });
  } catch (error) {
    console.log(`Error while resetting password:\n${error}`);
    return res.status(500).json({ message: "Unable to reset password" });
  }
};
