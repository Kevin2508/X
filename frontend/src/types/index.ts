export interface User {
  user_id: number;
  display_name: string;
  user_name: string;
  email: string;
  profile_image?: string;
  cover_image?: string;
  bio?: string;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
  created_at: string;
}

export interface Tweet {
  tweet_id: number;
  user_id: number;
  user: User;
  content: string;
  media?: TweetMedia[];
  likes_count: number;
  retweets_count: number;
  comments_count: number;
  is_liked: boolean;
  is_retweeted: boolean;
  created_at: string;
}

export interface TweetMedia {
  media_id: number;
  tweet_id: number;
  media_type: string;
  media: string;
}

export interface Comment {
  comment_id: number;
  user_id: number;
  user: User;
  tweet_id: number;
  content: string;
  parent_comment_id?: number;
  replies: Comment[];
  likes_count: number;
  is_liked: boolean;
  created_at: string;
}

export interface Notification {
  notification_id: number;
  user_id: number;
  actor_id: number;
  actor: User;
  tweet_id?: number;
  comment_id?: number;
  notification_type: 'like' | 'comment' | 'retweet' | 'follow';
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface AuthUser {
  user_id: number;
  user_name: string;
  email: string;
  display_name: string;
  profile_image?: string;
}
