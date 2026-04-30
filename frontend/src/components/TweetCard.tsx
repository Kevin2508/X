import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type MediaType = "image" | "video" | null;
type TweetType = "tweet" | "repost";

interface TweetCardProps {
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

// ─── Component ───────────────────────────────────────────────────────────────

export function TweetCard({
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
  onLike,
  onRetweet,
  onComment,
}: TweetCardProps) {
  const [liked, setLiked] = useState<boolean>(isLiked);
  const [retweeted, setRetweeted] = useState<boolean>(isRetweeted);
  const [likes, setLikes] = useState<number>(like_count);
  const [retweets, setRetweets] = useState<number>(retweet_count);

  const handleLike = (): void => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.();
  };

  const handleRetweet = (): void => {
    setRetweeted((prev) => !prev);
    setRetweets((prev) => (retweeted ? prev - 1 : prev + 1));
    onRetweet?.();
  };

  const initials: string = (display_name || user_name || "?")[0].toUpperCase();

  return (
    <Card className="p-4 comic-card comic-shadow">
      {/* Repost label */}
      {type === "repost" && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 ml-10">
          <Repeat2 size={13} />
          <span>You reposted</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar>
          {profile_image && (
            <AvatarImage src={profile_image} alt={display_name} />
          )}
          <AvatarFallback className="font-black uppercase text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="font-black uppercase text-base">
              {display_name || user_name}
            </span>
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
              src={media}
              alt="tweet media"
              className="mt-3 rounded-xl w-full max-h-72 object-cover border border-gray-200"
            />
          )}

          {/* Actions */}
          <div className="flex justify-between mt-4 text-xs font-black uppercase border-t-2 border-black pt-3">
            <button
              onClick={onComment}
              className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors"
            >
              <MessageCircle size={14} />
              <span>Comment</span>
            </button>

            <button
              onClick={handleRetweet}
              className={`flex items-center gap-1 cursor-pointer transition-colors ${
                retweeted ? "text-green-600" : "hover:text-green-600"
              }`}
            >
              <Repeat2 size={14} />
              <span>{retweets > 0 ? retweets : "Repost"}</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1 cursor-pointer transition-colors ${
                liked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <Heart size={14} fill={liked ? "currentColor" : "none"} />
              <span>{likes > 0 ? likes : "Like"}</span>
            </button>

            <button className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors">
              <Share size={14} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}