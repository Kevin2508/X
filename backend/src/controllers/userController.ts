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
export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserId = req.user?.user_id;
    const [result] = await db.query<User[]>(
      `select * from users where user_id != ? order by created_at desc`,
      [currentUserId ?? 0],
    );
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error });
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
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    const { display_name, bio, country } = req.body;

    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updateData: any = {};
    if (display_name !== undefined) updateData.display_name = display_name;
    if (bio !== undefined) updateData.bio = bio;
    if (country !== undefined) updateData.country = country;

    const setClause = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updateData), user_id];

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE users SET ${setClause} WHERE user_id = ?`,
      values
    );

    // Fetch updated user
    const [updatedUser] = await db.query<User[]>(
      `SELECT * FROM users WHERE user_id = ?`,
      [user_id]
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      result: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
// UPDATE COVER PIC
 export const updateCoverPic= async (req:AuthenticatedRequest , res:Response) => {
  console.log(req.file?.path);
  console.log(req.user?.user_id);
  
  
  try {
    const user_id = req.user?.user_id;
    
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const [row] = await db.query<ResultSetHeader>(
      `UPDATE users SET cover_image=? WHERE user_id=?`,
      [imageUrl, user_id]
    );

    return res.status(200).json({
      message: "Cover image updated successfully",
      user_id: user_id,
      url: imageUrl,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
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

        'tweet' AS type,
        NULL AS retweeted_by_user_name,
        NULL AS retweeted_by_display_name

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

        'retweet' AS type,
        ru.user_name AS retweeted_by_user_name,
        ru.display_name AS retweeted_by_display_name

      FROM retweet r
      JOIN tweets t ON r.tweet_id = t.tweet_id
      JOIN users u ON t.user_id = u.user_id
      JOIN users ru ON r.user_id = ru.user_id
      LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
      WHERE r.user_id IN (
        SELECT followee_id FROM follows WHERE follower_id = ?
      )

      ORDER BY created_at DESC
      `,
      [user_id, user_id, user_id, user_id, user_id, user_id],
    );

    res.json(withMediaItems(result));
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// get user profile image
 export const updateProfilePic= async (req:AuthenticatedRequest , res:Response) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const [row] = await db.query<ResultSetHeader>(
      `UPDATE users SET profile_image=? WHERE user_id=?`,
      [imageUrl, user_id]
    );

    return res.status(200).json({
      message: "Profile image updated successfully",
      user_id: user_id,
      url: imageUrl,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
