import { useEffect, useState } from "react";
import { TweetCard } from "./TweetCard";
import { useTweets } from "@/hooks/useTweets";
type MediaType = "image" | "video" | null;
interface TweetMediaItem {
  media: string;
  media_type: MediaType;
}
interface Tweet {
  tweet_id: number;
  user_name: string;
  display_name: string;
  content: string;
  created_at: string;
  profile_image?: string;
  media?: string;
  media_type?: MediaType;
  media_items?: TweetMediaItem[];
  like_count: number;
  retweet_count: number;
  isLiked: boolean;
  isRetweeted: boolean;
  type: "tweet" | "retweet";
  retweeted_by_user_name?: string | null;
  retweeted_by_display_name?: string | null;
}

export function TweetList() {
  const {getTweets, loading, error} = useTweets();
  const [tweets,setTweets] = useState<Tweet[]>([]);

  const handleTweetDeleted = (tweetId: number) => {
    setTweets((currentTweets) =>
      currentTweets.filter((tweet) => tweet.tweet_id !== tweetId),
    );
  };

       
    useEffect(()=>{
      let isMounted = true;

      const fetchTweets = async()=>{
        const data = await getTweets();
        if (isMounted) {
          setTweets(data ?? []);
        }
      };

      fetchTweets();

      return () => {
        isMounted = false;
      };
    },[]);
        
    if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded text-center">
        {error}
      </div>
    );
  }
      
  if (tweets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tweets yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    
    <div className="space-y-4 mt-4">
       
       {
        tweets.map((tweet)=>(
          <TweetCard
          tweet_id={tweet.tweet_id}
            key={tweet.tweet_id}
            user_name={tweet.user_name}
            display_name={tweet.display_name}
            content={tweet.content}
            created_at={tweet.created_at}
            profile_image={tweet.profile_image || ""}
            media={tweet.media || ""}
            media_type={tweet.media_type ?? null}
            media_items={tweet.media_items}
            like_count={tweet.like_count}
            retweet_count={tweet.retweet_count}
            isLiked={tweet.isLiked}
            isRetweeted = {tweet.isRetweeted}
            type={tweet.type === "retweet" ? "repost" : "tweet"}
            retweeted_by_user_name={tweet.retweeted_by_user_name}
            retweeted_by_display_name={tweet.retweeted_by_display_name}
            onDelete={handleTweetDeleted}
          ></TweetCard>
        ))
       }
    </div>
  );
}
