import { useEffect, useState } from "react";
import { userApi } from "@/api/userApi";
import { TweetCard } from "./TweetCard";
import { Loader2, MessageSquare } from "lucide-react";

interface Tweet {
  tweet_id: number;
  content: string;
  created_at: string;
  user_name: string;
  display_name: string;
  profile_image: string | null;
  media: string | null;
  media_type: "image" | "video" | null;
  media_items?: {
    media: string;
    media_type: "image" | "video" | null;
  }[];
  like_count: number;
  retweet_count: number;
  isLiked: boolean;
  isRetweeted: boolean;
  type?: "tweet" | "retweet";
  retweeted_by_user_name?: string | null;
  retweeted_by_display_name?: string | null;
}

interface UserTweetsProps {
  userId: number;
  tab: "posts" | "media" | "likes" | "bookmarks";
}

export function UserTweets({ userId, tab }: UserTweetsProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTweetDeleted = (tweetId: number) => {
    setTweets((currentTweets) =>
      currentTweets.filter((tweet) => tweet.tweet_id !== tweetId),
    );
  };

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        setError(null);

        if (tab === "posts") {
          const data = await userApi.getUserTweets(userId);
          // Handle various response formats
          let tweets = [];
          if (Array.isArray(data)) {
            tweets = data;
          } else if (data?.result && Array.isArray(data.result)) {
            tweets = data.result;
          } else if (data?.data && Array.isArray(data.data)) {
            tweets = data.data;
          }
          setTweets(tweets);
        } else {
          // TODO: Implement other tabs (media, likes, bookmarks) with additional API calls
          setTweets([]);
        }
      } catch (err) {
        console.error("Failed to fetch tweets:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [userId, tab]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-b border-neutral-200 py-12 text-center">
        <p className="font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="border-b border-neutral-200">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare size={48} className="text-gray-300 mb-4" />
          <p className="text-lg font-medium text-neutral-500">
            {tab === "posts" && "No posts yet"}
            {tab === "media" && "No media posts yet"}
            {tab === "likes" && "No liked posts yet"}
            {tab === "bookmarks" && "No bookmarks yet"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0 border-b border-neutral-200">
      {tweets.map((tweet) => (
        <div key={tweet.tweet_id} className="border-b border-neutral-200">
          <TweetCard
            tweet_id={tweet.tweet_id}
            content={tweet.content}
            created_at={tweet.created_at}
            user_name={tweet.user_name}
            display_name={tweet.display_name}
            profile_image={tweet.profile_image}
            media={tweet.media}
            media_type={tweet.media_type}
            media_items={tweet.media_items}
            like_count={tweet.like_count}
            retweet_count={tweet.retweet_count}
            isLiked={tweet.isLiked}
            isRetweeted={tweet.isRetweeted}
            type={tweet.type === "retweet" ? "repost" : "tweet"}
            retweeted_by_user_name={tweet.retweeted_by_user_name}
            retweeted_by_display_name={tweet.retweeted_by_display_name}
            onDelete={handleTweetDeleted}
          />
        </div>
      ))}
    </div>
  );
}
