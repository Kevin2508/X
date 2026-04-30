import { useState } from "react";
import { TweetCard } from "./TweetCard";
import { useAuth } from "@/context/AuthContext";
import { useTweets } from "@/hooks/useTweets";

export async function TweetList() {
  const user = useAuth();
  const {getTweets, loading, error} = useTweets();

       
        const data = await getTweets();
        console.log(data);
      
  return (
    
    <div className="space-y-4 mt-4">
      
      <TweetCard user_name="John" content="Hello world!" created_at="2026-04-30" display_name="kevin" isLiked={false} isRetweeted={false} like_count={2} media={""} media_type={"image"} profile_image={""} retweet_count={4} type="tweet" />
       
    </div>
  );
}