import { Request, Response } from "express";
import { AuthenticatedRequest, User } from "../types";
import db from "../config/database";
import { ResultSetHeader } from "mysql2";

// LIKE
export const likeTweet = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const actor_id = req.user?.user_id;
    const tweet_id = req.params.tweet_id;
    console.log(req.params);
    const [user] = await db.query<User[]>(
      `select user_id from tweets where tweet_id = ?`,
      [tweet_id],
    );
    const user_id = user[0].user_id;
    console.log(user_id);
    const [result] = await db.query<ResultSetHeader>(
      `insert into reactions(user_id,tweet_id,is_liked) values(?,?,?)`,
      [actor_id, tweet_id, true],
    );

    const content = `user:${user_id} liked your tweet`;
    const notification_type = "like";

    const [insertNotification] = await db.query<ResultSetHeader>(
      `insert into notifications(user_id,actor_id,tweet_id,comment_id,content,notification_type, is_read) values(?,?,?,?,?,?,?)`,
      [user_id, actor_id, tweet_id, null, content, notification_type, false],
    );
    res.status(200).json({ message: "Successfully liked" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// DISLIKE

export const dislikeTweet = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const actor_id = req.user?.user_id;
    const tweet_id = req.params.tweet_id;

    const result = db.query<ResultSetHeader>(
      `delete from reactions where user_id = ? and tweet_id = ?`,
      [actor_id, tweet_id],
    );

    const deleteNotification = db.query<ResultSetHeader>(
      `delete from notifications where actor_id = ? and tweet_id = ? and notification_type = 'like'`,
      [actor_id, tweet_id],
    );
    return res.status(200).json({ message: "Dislike successful" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// RETWEET

export const retweet = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const actor_id = req.user?.user_id;
    const tweet_id = req.params.tweet_id;
    const result = db.query<ResultSetHeader>(
      `insert into retweet(user_id,tweet_id) values(?,?)`,
      [actor_id, tweet_id],
    );
    const [user] = await db.query<User[]>(
      `select user_id from tweets where tweet_id = ?`,
      [tweet_id],
    );
    const user_id = user[0].user_id;
    console.log(user_id);
    

    const content = `user:${user_id} retweeted your tweet`;
    const notification_type = "retweet";

    const [insertNotification] = await db.query<ResultSetHeader>(
      `insert into notifications(user_id,actor_id,tweet_id,comment_id,content,notification_type, is_read) values(?,?,?,?,?,?,?)`,
      [user_id, actor_id, tweet_id, null, content, notification_type, false],
    );
    return res.status(200).json({ message: "retweeted successful" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
