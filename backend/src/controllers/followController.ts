import { Request, Response } from "express";
import { AuthenticatedRequest, User } from "../types";
import db from "../config/database";
import { ResultSetHeader } from "mysql2";

export const followUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const follower_id = req.user?.user_id;
    const followee_id = req.params.followee_id;
    const result = await db.query<ResultSetHeader>(
      `insert into follows(follower_id,followee_id) values(?,?)`,
      [follower_id, followee_id],
    );
    const content = `follower:${follower_id} has followed you`;
    const notification_type = "follow";
    const [insertNotification] = await db.query<ResultSetHeader>(
      `insert into notifications(user_id,actor_id,tweet_id,comment_id,content,notification_type, is_read) values(?,?,?,?,?,?,?)`,
      [followee_id, follower_id, null, null, content, notification_type, false],
    );
    return res.status(200).json({ message: "Follow successfull" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const unfollowUser = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const follower_id = req.user?.user_id;
    const followee_id = req.params.followee_id;
    const result = await db.query<ResultSetHeader>(
      `delete from follows where follower_id = ? and followee_id = ?`,
      [follower_id, followee_id],
    );

    const notification_type = "follow";
    const [deleteNotification] = await db.query<ResultSetHeader>(
      `delete from notifications where actor_id = ? and user_id = ? and notification_type = 'follow' `,
      [follower_id, followee_id, notification_type],
    );
    return res.status(200).json({ message: "unFollow successfull" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id;
    const [followers] = await db.query<User[]>(
      `select users.* from follows join users on follows.follower_id = users.user_id where follows.followee_id = ?`,
      [user_id],
    );
    return res.status(200).json(followers);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id;
    const [followers] = await db.query<User[]>(
      `select users.* from follows join users on follows.followee_id = users.user_id where follows.follower_id = ?`,
      [user_id],
    );
    return res.status(200).json(followers);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const checkFollowing = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user_id = req.user?.user_id;
    const followee_id = req.params.followee_id;
    const [result] = await db.query<any[]>(
      `select * from follows where followee_id = ? and follower_id = ?`,
      [followee_id, user_id],
    );

    return res.status(200).json({ isFollowing: result.length > 0 });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
