import { Request, Response } from "express";
import { AuthenticatedRequest, Tweets, User } from "../types";
import db from "../config/database";
export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    const [result] = await db.query<User[]>(
      `select * from users where user_id = ?`,
      [user_id],
    );
    return res.status(200).json({ result });
  } catch (error) {
    res.status(200).json({ error });
  }
};
export const getUserbyId = async (req: Request, res: Response) => {
     try {
    const user_id = req.params.user_id;
    const [result] = await db.query<User[]>(
      `select * from users where user_id = ?`,
      [user_id],
    );
    return res.status(200).json({ result });
  } catch (error) {
    res.status(200).json({ error });
  }
};
export const getUserbyUserName = async (req: Request, res: Response) => {
     try {
    const user_name = req.params.user_name;
    console.log(user_name)
    const [result] = await db.query<User[]>(
      `select * from users where user_name = ?`,
      [user_name],
    );
    return res.status(200).json({ result, message :"hiii" });
  } catch (error) {
    res.status(200).json({ error });
  }
};
export const updateProfile = async (req: Request, res: Response) => {};
export const updateProfilePic = async (req: Request, res: Response) => {};
export const updateCoverPic = async (req: Request, res: Response) => {};
export const deleteUser = async (req: Request, res: Response) => {};
export const getUserFeed = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;
  try {
    const [result] = await db.query<any[]>(
      `
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
          FROM reactions r1 
          WHERE r1.tweet_id = t.tweet_id
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
          SELECT 1 FROM reactions r 
          WHERE r.tweet_id = t.tweet_id AND r.user_id = ?
        ) AS isLiked,

        'tweet' AS type

      FROM tweets t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
      WHERE t.user_id IN (
        SELECT followee_id FROM follows WHERE follower_id = ?
      )

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
          SELECT 1 FROM reactions r2 
          WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
        ) AS isLiked,

        'retweet' AS type

      FROM retweet r
      JOIN tweets t ON r.tweet_id = t.tweet_id
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
      WHERE r.user_id IN (
        SELECT followee_id FROM follows WHERE follower_id = ?
      )

      ORDER BY created_at DESC
      `,
      [user_id, user_id, user_id, user_id, user_id, user_id],
    );

    res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
