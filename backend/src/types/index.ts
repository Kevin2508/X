import { RowDataPacket } from "mysql2";

export interface signUp extends RowDataPacket{
    id : number;
    userName: string;
    email: string;
    password: string;
    roleId: number;
}

export interface jwtPayload{
    id:number,
    user_name:string,
    email:string
}

export interface JWT_SECRET{
    secret:string
}
export interface User extends RowDataPacket{
    user_name:string;
    email:string;
    password:string;
}