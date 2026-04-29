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
export const getSpecificTweet = async(req:AuthenticatedRequest, res:Response)=>{
    try {
        const id = req.params.id;
        const user_id = req.user?.user_id
        const [result] = await db.query<Tweets[]>(`
           SELECT 
        t.tweet_id,
        t.content,
        t.created_at,
        u.user_name,
        u.display_name,
        u.profile_image,
        m.media,
        m.media_type,

        (
          SELECT COUNT(*) 
          FROM reactions r 
          WHERE r.tweet_id = t.tweet_id
        ) AS like_count,
         (
          SELECT COUNT(*) 
          FROM retweet rt2 
          WHERE rt2.tweet_id = t.tweet_id
        ) AS retweet_count,
         EXISTS (
  SELECT 1
  FROM retweet rt
  WHERE rt.tweet_id = t.tweet_id 
    AND rt.user_id = ?
) AS isRetweeted,

        EXISTS (
          SELECT 1 
          FROM reactions r2 
          WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
        ) AS isLiked

      FROM tweets t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
      WHERE t.tweet_id = ?
          
          `, [user_id,user_id,id]);

        res.json(result);
    } catch (error) {
        console.log("error while getting specific tweet:",error);
    }
}

// GET USER TWEETS
export const getUserTweets = async(req:Request,res:Response)=>{
    try {
        const id = req.params.id;
        const [result] = await db.query<Tweets[]>(`SELECT 
        t.tweet_id,
        t.content,
        t.created_at,
        u.user_name,
        u.display_name,
        u.profile_image,
        m.media,
        m.media_type,

        (
          SELECT COUNT(*) 
          FROM reactions r 
          WHERE r.tweet_id = t.tweet_id
        ) AS like_count,

        (
          SELECT COUNT(*) 
          FROM retweet rt 
          WHERE rt.tweet_id = t.tweet_id
        ) AS retweet_count,

        EXISTS (
  SELECT 1
  FROM retweet rt
  WHERE rt.tweet_id = t.tweet_id 
    AND rt.user_id = ?
) AS isRetweeted,

        EXISTS (
          SELECT 1 
          FROM reactions r2 
          WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
        ) AS isLiked,

        'tweet' AS type

      FROM tweets t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
      WHERE t.user_id = ?

      UNION ALL

      SELECT 
        t.tweet_id,
        t.content,
        r.created_at,
        u.user_name,
        u.display_name,
        u.profile_image,
        m.media,
        m.media_type,

        (
          SELECT COUNT(*) 
          FROM reactions r3 
          WHERE r3.tweet_id = t.tweet_id
        ) AS like_count,

        (
          SELECT COUNT(*) 
          FROM retweet rt2 
          WHERE rt2.tweet_id = t.tweet_id
        ) AS retweet_count,
         EXISTS (
  SELECT 1
  FROM retweet rt
  WHERE rt.tweet_id = t.tweet_id 
    AND rt.user_id = ?
) AS isRetweeted,

        EXISTS (
          SELECT 1 
          FROM reactions r4 
          WHERE r4.tweet_id = t.tweet_id AND r4.user_id = ?
        ) AS isLiked,

        'retweet' AS type

      FROM retweet r
      JOIN tweets t ON r.tweet_id = t.tweet_id
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
      WHERE r.user_id = ?

      ORDER BY created_at DESC`, [id,id,id,id,id,id]);

        res.json(result);
    } catch (error) {
        console.log("error while getting user tweet:",error);
    }
}