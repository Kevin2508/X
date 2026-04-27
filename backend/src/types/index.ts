import { RowDataPacket } from "mysql2";


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