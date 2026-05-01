import { useEffect, useState } from "react";
import { TweetCard } from "./TweetCard";
import { useAuth } from "@/context/AuthContext";
import { useTweets } from "@/hooks/useTweets";
type MediaType = "image" | "video" | null;
interface Tweet {
  tweet_id: number;
  user_name: string;
  display_name: string;
  content: string;
  created_at: string;
  profile_image?: string;
  media?: string;
  media_type?: MediaType;
  like_count: number;
  retweet_count: number;
  isLiked: boolean;
  isRetweeted: boolean;
  type: "tweet" | "retweet";
}

export function TweetList() {
  const {getTweets, loading, error} = useTweets();
  const [tweets,setTweets] = useState<Tweet[]>([]);

       
    useEffect(()=>{
      const fetchTweets = async()=>{
        const data = await getTweets();
        setTweets(data)
        
      }
      fetchTweets();
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
      
      <TweetCard user_name="John" content="Hello world!" created_at="2026-04-30" display_name="kevin" isLiked={false} isRetweeted={false} like_count={2} media={""} media_type={"image"} profile_image={""} retweet_count={4} type="tweet" />
       
       {
        tweets.map((tweet)=>(
          <TweetCard
            key={tweet.tweet_id}
            user_name={tweet.user_name}
            display_name={tweet.display_name}
            content={tweet.content}
            created_at={tweet.content}
            profile_image={tweet.profile_image || ""}
            media={tweet.media || ""}
            media_type={tweet.media_type || "image"}
            like_count={tweet.like_count}
            retweet_count={tweet.retweet_count}
            isLiked={tweet.isLiked}
            isRetweeted = {tweet.isRetweeted}
            type="tweet"
          ></TweetCard>
        ))
       }
    </div>
  );
}