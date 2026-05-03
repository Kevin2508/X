import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import API from "@/api/axios";
import { TweetThreadDetail } from "./TweetThreadDetail";
import { getProperImageUrl } from "@/utils/imageUtils";

// ─── Types ───────────────────────────────────────────────────────────────────

type MediaType = "image" | "video" | null;
type TweetType = "tweet" | "repost";

interface TweetCardProps {
    tweet_id:number;
  content: string;
  created_at: string;
  user_name: string;
  display_name: string;
  profile_image: string | null;
  media: string | null;
  media_type: MediaType;
  like_count: number;
  retweet_count: number;
  isLiked: boolean;
  isRetweeted: boolean;
  type: TweetType;
  retweeted_by_user_name?: string | null;
  retweeted_by_display_name?: string | null;
  onLike?: () => void;
  onRetweet?: () => void;
  onComment?: () => void;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getMediaUrl(mediaPath: string | null | undefined): string | null {
  if (!mediaPath) return null;

  // If it's already a URL, return it
  if (mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
    return mediaPath;
  }

  // If it's a local file path, extract filename and construct API URL
  if (mediaPath.includes("uploads")) {
    // Extract filename from path
    // e.g., "E:\\My Projects\\X\\backend\\src\\uploads\\file-1777571813138-221684312.jpg"
    // becomes "file-1777571813138-221684312.jpg"
    const filename = mediaPath.split(/[\\/]/).pop();
    if (filename) {
      // Construct full URL from your API base
      const apiBase = "http://localhost:3000";
      return `${apiBase}/uploads/${filename}`;
    }
  }

  return null;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TweetCard({
    tweet_id,
  content,
  created_at,
  user_name,
  display_name,
  profile_image,
  media,
  media_type,
  like_count,
  retweet_count,
  isLiked,
  isRetweeted,
  type,
  retweeted_by_user_name,
  retweeted_by_display_name,
  onLike,
  onRetweet,
  onComment,
}: TweetCardProps) {
  const navigate = useNavigate();
  const [showThread,setShowThread] = useState(false);
  const [focusComment, setFocusComment] = useState(false);
  const [liked, setLiked] = useState<boolean>(isLiked);
  const [retweeted, setRetweeted] = useState<boolean>(isRetweeted);
  const [likes, setLikes] = useState<number>(like_count);
  const [retweets, setRetweets] = useState<number>(retweet_count);

  // Handle Like
  const handleLike = async (): Promise<void> => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.();
    try {
      if (isLiked) {
        await API.delete(`/interaction/${tweet_id}/like`);
        
      } else {
        await API.post(`/interaction/${tweet_id}/like`);
      }
    } catch (error) {
        setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev + 1 : prev - 1));
    console.error("Failed to update like:", error);
    }
  };

  const handleRetweet = async(): Promise<void> => {
    setRetweeted((prev) => !prev);
    setRetweets((prev) => (retweeted ? prev - 1 : prev + 1));
    onRetweet?.();
    try {
        if(isRetweeted){
            await API.delete(`interaction/${tweet_id}/retweet`)
        }else{
            await API.post(`interaction/${tweet_id}/retweet`)
        }
    } catch (error) {
        setRetweeted((prev) => !prev);
    setRetweets((prev) => (retweeted ? prev + 1 : prev - 1));
    console.error("Failed to update Retweet:", error);
    }
  };
  const mediaUrl = getMediaUrl(media);

  const initials: string = (display_name || user_name || "?")[0].toUpperCase();

  return (
    <>
    <Card onClick={()=>{setShowThread(true)}} className="p-4 comic-card comic-shadow cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-black border-2 hover:-translate-y-1">
      {/* Repost label */}
      {type === "repost" && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 ml-10 font-bold">
          <Repeat2 size={13} />
          <span>
            {(retweeted_by_display_name || retweeted_by_user_name || "You")} retweeted this post
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${user_name}`);
          }}
          className="hover:opacity-80 transition-opacity duration-200"
        >
          <Avatar className="border-2 border-black">
            {profile_image && (
              <AvatarImage src={getProperImageUrl(profile_image) || ""} alt={display_name} />
            )}
            <AvatarFallback className="font-black uppercase text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-1 flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${user_name}`);
              }}
              className="font-black uppercase text-base hover:underline transition-all duration-200"
            >
              {display_name || user_name}
            </button>
            <span className="text-gray-500 text-sm">@{user_name}</span>
            <span className="text-gray-400 text-sm">·</span>
            <span className="text-gray-400 text-sm">{timeAgo(created_at)}</span>
          </div>

          {/* Content */}
          <p className="text-black text-sm font-bold mt-2 break-words">
            {content}
          </p>

          {/* Media */}
          {media && media_type === "image" && (
            <img
              src={mediaUrl || ""}
              alt="tweet media"
              className="mt-3 rounded-lg w-full max-h-72 object-cover border-2 border-black hover:brightness-95 transition-all duration-300"
              onError={(e) => {
                console.error("Failed to load image:", mediaUrl);
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          {/* Actions */}
          <div className="flex justify-between mt-4 text-xs font-black uppercase border-t-2 border-black pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowThread(true);
                setFocusComment(true);
                onComment?.();
              }}
              className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <MessageCircle size={14} />
              <span>Comment</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRetweet();
              }}
              className={`flex items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${
                retweeted ? "text-green-600" : "hover:text-green-600"
              }`}
            >
              <Repeat2 size={14} />
              <span>{retweets > 0 ? retweets : "Repost"}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`flex items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${
                liked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <Heart size={14} fill={liked ? "currentColor" : "none"} />
              <span>{likes > 0 ? likes : "Like"}</span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <Share size={14} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
    {/* Thread Modal */}
      {showThread && (
        <TweetThreadDetail
          tweet_id={tweet_id}
          content={content}
          created_at={created_at}
          user_name={user_name}
          display_name={display_name}
          profile_image={profile_image}
          media={media}
          media_type={media_type}
          like_count={like_count}
          retweet_count={retweet_count}
          isLiked={liked}
          isRetweeted={retweeted}
          focusComment={focusComment}
          onClose={() => {
            setShowThread(false);
            setFocusComment(false);
          }}
        />
      )}
    </>
  );
}
