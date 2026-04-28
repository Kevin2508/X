import { RowDataPacket } from "mysql2";
import { Request } from "express";

export interface JwtPayload{
    id:number,
    user_name:string,
    email:string
}

export interface User extends RowDataPacket{
    user_id:number,
    user_name:string;
    email:string;
    password:string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}