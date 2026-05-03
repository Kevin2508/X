import { Request, Response } from "express";
import { AuthenticatedRequest, Tweets, User } from "../types";
import db from "../config/database";
import { ResultSetHeader } from "mysql2";

const withMediaItems = (rows: any[]) => {
  const groupedTweets = new Map<string, any>();

  rows.forEach((row) => {
    const groupKey = [
      row.tweet_id,
      row.type ?? "tweet",
      row.retweeted_by_user_name ?? "",
    ].join("-");

    if (!groupedTweets.has(groupKey)) {
      groupedTweets.set(groupKey, {
        ...row,
        media_items: [],
        media: row.media ?? null,
        media_type: row.media_type ?? null,
      });
    }

    if (row.media) {
      groupedTweets.get(groupKey).media_items.push({
        media: row.media,
        media_type: row.media_type,
      });
    }
  });

  return Array.from(groupedTweets.values());
};

// CREATE TWEET
export const createTweet = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    const content = req.body.content?.trim() ?? "";
    const files = (req.files as Express.Multer.File[]) ?? [];
    if (!content && files.length === 0) {
      return res.status(400).json({ message: "Content or media required" });
    }

    const videoCount = files.filter((file) => file.mimetype.startsWith("video")).length;
    if (videoCount > 1) {
      return res.status(400).json({ message: "Only one video can be uploaded per tweet" });
    }

    const [result] = await db.query<ResultSetHeader>(
      `insert into tweets(user_id,content) values(?,?)`,
      [user_id, content],
    );
    const tweet_id = result.insertId;

    if (files.length > 0) {
      await Promise.all(
        files.map((file) => {
          const media_type = file.mimetype.startsWith("image") ? "image" : "video";

          return db.query<ResultSetHeader>(
            `insert into tweet_media(tweet_id,media_type,media) values(?,?,?) `,
            [tweet_id, media_type, file.path],
          );
        }),
      );
    }

    return res.status(201).json({
      message: "tweet uploaded successfully",
      tweet_id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create tweet" });
  }
};

// DELETE OWN TWEET
export const deleteTweet = async (req: AuthenticatedRequest, res: Response) => {
  const connection = await db.getConnection();

  try {
    const user_id = req.user?.user_id;
    const tweet_id = req.params.id;

    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [tweets] = await connection.query<Tweets[]>(
      `select user_id from tweets where tweet_id = ? limit 1`,
      [tweet_id],
    );

    if (tweets.length === 0) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    if (Number(tweets[0].user_id) !== Number(user_id)) {
      return res.status(403).json({ message: "You can delete only your own tweets" });
    }

    await connection.beginTransaction();

    await connection.query(
      `delete cr from comment_reactions cr
       join comments c on cr.comment_id = c.comment_id
       where c.tweet_id = ?`,
      [tweet_id],
    );
    await connection.query(`delete from comments where tweet_id = ?`, [tweet_id]);
    await connection.query(`delete from reactions where tweet_id = ?`, [tweet_id]);
    await connection.query(`delete from retweet where tweet_id = ?`, [tweet_id]);
    await connection.query(`delete from tweet_media where tweet_id = ?`, [tweet_id]);
    await connection.query(`delete from tweets where tweet_id = ?`, [tweet_id]);

    await connection.commit();

    return res.status(200).json({ message: "Tweet deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.log("error while deleting tweet:", error);
    return res.status(500).json({ message: "Failed to delete tweet" });
  } finally {
    connection.release();
  }
};

// GET ALL TWEETS
export const getAllTweets = async (req: Request, res: Response) => {
  try {
    const [result] = await db.query<Tweets[]>(`select * from tweets left join tweet_media on tweets.tweet_id = tweet_media.tweet_id`)

    res.json(withMediaItems(result));
  } catch (error) {
    console.log("error while getting all users:", error);
  }
}

// GET SPECIFIC TWEET
export const getSpecificTweet = async (req: AuthenticatedRequest, res: Response) => {
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
          
          `, [user_id, user_id, id]);

    res.json(withMediaItems(result));
  } catch (error) {
    console.log("error while getting specific tweet:", error);
  }
}

// GET USER TWEETS
export const getUserTweets = async (req: Request, res: Response) => {
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

      ORDER BY created_at DESC`, [id, id, id, id, id, id]);

    res.json(withMediaItems(result));
  } catch (error) {
    console.log("error while getting user tweet:", error);
  }
}
