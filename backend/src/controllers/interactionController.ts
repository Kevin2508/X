import { Request, Response } from "express";
import { AuthenticatedRequest, Comments, User } from "../types";
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

// DELETE RETWEET

export const deleteRetweet = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const actor_id = req.user?.user_id;
    const tweet_id = req.params.tweet_id;

    const result = db.query<ResultSetHeader>(
      `delete from retweet where user_id = ? and tweet_id = ?`,
      [actor_id, tweet_id],
    );

    const deleteNotification = db.query<ResultSetHeader>(
      `delete from notifications where actor_id = ? and tweet_id = ? and notification_type = 'retweet'`,
      [actor_id, tweet_id],
    );
    return res.status(200).json({ message: "Delete retweet successful" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// COMMENTS ON TWEET

export const comment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const actor_id = req.user?.user_id;
    const tweet_id = req.params.tweet_id;
    const comment = req.body.comment;
    const result = db.query<ResultSetHeader>(
      `insert into comments(user_id,tweet_id,content,parent_comment_id) values(?,?,?,?)`,
      [actor_id, tweet_id, comment, null],
    );

    const [user] = await db.query<User[]>(
      `select user_id from tweets where tweet_id = ?`,
      [tweet_id],
    );
    const user_id = user[0].user_id;
    console.log(user_id);

    const content = `user:${user_id} commented your tweet`;
    const notification_type = "comment";

    const [insertNotification] = await db.query<ResultSetHeader>(
      `insert into notifications(user_id,actor_id,tweet_id,comment_id,content,notification_type, is_read) values(?,?,?,?,?,?,?)`,
      [user_id, actor_id, tweet_id, null, content, notification_type, false],
    );
    return res.status(200).json({ message: "comment successful" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// GET COMMENTS ON A TWEET

export const getComment = async (req: Request, res: Response) => {
  try {
    const tweet_id = req.params.tweet_id;
    const [comments] = await db.query<any[]>(
      `SELECT
c.comment_id,
c.content,
c.created_at,
u.user_name,
u.display_name,
u.profile_image
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.tweet_id = ?
AND c.parent_comment_id IS NULL
ORDER BY c.created_at DESC
`,
      [tweet_id],
    );

    // Fetch nested replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const [replies] = await db.query<any[]>(
          `SELECT
c.comment_id,
c.content,
c.created_at,
u.user_name,
u.display_name,
u.profile_image,
c.parent_comment_id
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.parent_comment_id = ?
ORDER BY c.created_at ASC
`,
          [comment.comment_id],
        );
        return {
          ...comment,
          replies: replies || [],
        };
      }),
    );

    return res.status(200).json(commentsWithReplies);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// DELETE COMMENT

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment_id = req.params.comment_id;
    const result = await db.query<ResultSetHeader>(
      `delete from comments where comment_id = ?`,
      [comment_id],
    );

    const deleteNotification = db.query<ResultSetHeader>(
      `delete from notifications where comment_id = ?`,
      [comment_id],
    );
    res.status(200).json({ message: "Delete successfull" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// LIKE COMMENT

export const likeComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const actor_id = req.user?.user_id;
    const comment_id = req.params.comment_id;
    const result = await db.query<ResultSetHeader>(
      `insert into comment_reactions(user_id,comment_id) values(?,?)`,
      [actor_id, comment_id],
    );

    const [user] = await db.query<User[]>(
      `select user_id from comments where comment_id = ?`,
      [comment_id],
    );
    const user_id = user[0].user_id;
    console.log(user_id);

    const content = `user:${user_id} liked your comment`;
    const notification_type = "commentLike";

    const [insertNotification] = await db.query<ResultSetHeader>(
      `insert into notifications(user_id,actor_id,tweet_id,comment_id,content,notification_type, is_read) values(?,?,?,?,?,?,?)`,
      [user_id, actor_id, null, comment_id, content, notification_type, false],
    );
    return res.status(200).json({ message: "comment liked" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const dislikeComment = async(req:AuthenticatedRequest,res:Response)=>{
  try {
    const actor_id = req.user?.user_id;
    const comment_id = req.params.comment_id;
    const result = await db.query<ResultSetHeader>(
      `delete from comment_reactions where user_id = ? and comment_id = ?`,
      [actor_id, comment_id],
    );

    const notification_type = "commentLike";

    const [insertNotification] = await db.query<ResultSetHeader>(
      `delete from notifications where actor_id = ? and comment_id = ? and notification_type = ?`,
      [actor_id,comment_id,notification_type],
    );
    return res.status(200).json({ message: "comment disliked" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

// REPLY ON A COMMENT

export const commentsReply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const actor_id = req.user?.user_id;
    const comment_parent_id = req.params.comment_id;
    const comment = req.body.comment;
    const result = db.query<ResultSetHeader>(
      `insert into comments(user_id,tweet_id,content,parent_comment_id) values(?,?,?,?)`,
      [actor_id, null, comment, comment_parent_id],
    );

    const [user] = await db.query<User[]>(
      `select user_id from comments where comment_id = ?`,
      [comment_parent_id],
    );
    const user_id = user[0].user_id;

    const content = `user:${user_id} replied to your comment`;
    const notification_type = "reply";

    const [insertNotification] = await db.query<ResultSetHeader>(
      `insert into notifications(user_id,actor_id,tweet_id,comment_id,content,notification_type, is_read) values(?,?,?,?,?,?,?)`,
      [user_id, actor_id, null,comment_parent_id, content, notification_type, false],
    );
    return res.status(200).json({ message: "Replied successful" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};


// DELETE A REPLY

export const deleteReply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const actor_id = req.user?.user_id;
    const comment_id = req.params.comment_id;
    const result = db.query<ResultSetHeader>(
      `delete from comments where comment_id = ? `,
      [comment_id],
    );
    const notification_type = "reply";

    const [insertNotification] = await db.query<ResultSetHeader>(
      `delete from notifications where actor_id = ? and comment_id = ? and notification_type = ?`,
      [actor_id, comment_id, notification_type],
    );
    return res.status(200).json({ message: "Reply deleted successful" });
  } catch (error) {
    return res.status(400).json(error);
  }
};
// GET REPLIES BY COMMENT ID
export const getRepliesByCommentId = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const parentCommentId = Number(req.params.comment_id);

    // check if parent comment exists
    const [parentRows] = await db.query<any[]>(
      `SELECT comment_id FROM comments WHERE comment_id = ?`,
      [parentCommentId],
    );
    if (parentRows.length === 0) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const [result] = await db.query<Comments[]>(
      `SELECT
c.comment_id,
c.content,
c.created_at,
u.user_name,
u.display_name,
u.profile_image
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.parent_comment_id = ?
ORDER BY c.created_at ASC`,
      [parentCommentId],
    );
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
