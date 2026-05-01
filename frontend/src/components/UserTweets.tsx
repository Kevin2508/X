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
  like_count: number;
  retweet_count: number;
  isLiked: boolean;
  isRetweeted: boolean;
}

interface UserTweetsProps {
  userId: number;
  tab: "posts" | "media" | "likes" | "bookmarks";
}

export function UserTweets({ userId, tab }: UserTweetsProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="text-center py-12 border-b-2 border-black">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="border-b-2 border-black">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold text-lg">
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
    <div className="space-y-0 border-b-2 border-black">
      {tweets.map((tweet) => (
        <div key={tweet.tweet_id} className="border-b-2 border-black">
          <TweetCard
            tweet_id={tweet.tweet_id}
            content={tweet.content}
            created_at={tweet.created_at}
            user_name={tweet.user_name}
            display_name={tweet.display_name}
            profile_image={tweet.profile_image}
            media={tweet.media}
            media_type={tweet.media_type}
            like_count={tweet.like_count}
            retweet_count={tweet.retweet_count}
            isLiked={tweet.isLiked}
            isRetweeted={tweet.isRetweeted}
            type="tweet"
          />
        </div>
      ))}
    </div>
  );
}
