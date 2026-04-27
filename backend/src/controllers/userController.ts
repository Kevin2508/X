import { Request,Response } from "express"
export const getUser = async(req:Request, res:Response) =>{
    try {
        return res.status(200).json({message:"Hello from user controller"});
    } catch (error) {
        
    }
}    