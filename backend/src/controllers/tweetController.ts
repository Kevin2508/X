import { Request, Response } from "express";
import { AuthenticatedRequest, Tweets, User } from "../types";
import db from "../config/database";
import { ResultSetHeader } from "mysql2";

// CREATE TWEET
export const createTweet = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    const content = req.body.content;
    const files = req.file;
    if (!content) {
      return res.status(400).json({ message: "Content required" });
    }
    const [result] = await db.query<ResultSetHeader>(
      `insert into tweets(user_id,content) values(?,?)`,
      [user_id, content],
    );
    const tweet_id = result.insertId;

    if (files) {
      res.json({
        message: "File uploaded successfully",
        file: {
          filename: files.filename,
          originalName: files.originalname,
          size: files.size,
          mimetype: files.mimetype,
          path: files.path,
        },
      });
    }
    let media_type = "";
    if (files?.mimetype.startsWith("image")) {
      media_type = "image";
    } else {
      media_type = "video";
    }
    const [insertMedia] = await db.query<ResultSetHeader>(
      `insert into tweet_media(tweet_id,media_type,media) values(?,?,?) `,
      [tweet_id,media_type,files?.path],
    );
  } catch (error) {
    console.log(error);
  }
};

// GET ALL TWEETS
export const getAllTweets = async(req:Request, res:Response)=>{
    try {
        const [result] = await db.query<Tweets[]>(`select * from tweets left join tweet_media on tweets.tweet_id = tweet_media.tweet_id`)

        res.json(result);
    } catch (error) {
        console.log("error while getting all users:",error);
    }
}

// GET SPECIFIC TWEET
export const getSpecificTweet = async(req:Request, res:Response)=>{
    try {
        const id = req.params.id;
        const [result] = await db.query<Tweets[]>(`select * from tweets left join tweet_media on tweets.tweet_id = tweet_media.tweet_id where tweets.tweet_id = ?`, [id]);

        res.json(result);
    } catch (error) {
        console.log("error while getting specific tweet:",error);
    }
}

// GET USER TWEETS
export const getUserTweets = async(req:Request,res:Response)=>{
    try {
        const id = req.params.id;
        const [result] = await db.query<Tweets[]>(`select * from tweets left join tweet_media on tweets.tweet_id = tweet_media.tweet_id where tweets.user_id = ?`, [id]);

        res.json(result);
    } catch (error) {
        console.log("error while getting user tweet:",error);
    }
}