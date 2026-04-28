import {Request,Response} from 'express';
import { AuthenticatedRequest } from '../types';
export const createTweet = async(req:AuthenticatedRequest, res:Response)=>{
    try {
        const user_id = req.user?.user_id;
        const content = req.body;
        const files = req.file as unknown as Express.Multer.File[];
        if(!content){
            return res.status(400).json({message:"Content required"});
        }
        
        
    } catch (error) {
        
    }
}