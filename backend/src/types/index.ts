import { RowDataPacket } from "mysql2";
import { Request } from "express";

export interface JwtPayload {
  id: number;
  user_name: string;
  email: string;
}

export interface User extends RowDataPacket {
  user_id: number;
  user_name: string;
  email: string;
  password: string;
  display_name: string;
  country: string;
  profile_image: string;
  cover_image: string;
  bio: string;
  date_of_birth: string;
  is_verified: boolean;
  created_at: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface Tweets extends RowDataPacket {
    user_id:number,
    tweet_id: number,
    content: string,
    media_type: string,
    media:string,
    created_at: string
}
