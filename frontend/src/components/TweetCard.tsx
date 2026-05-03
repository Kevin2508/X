import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Heart, MessageCircle, Repeat2, Share, Trash2 } from "lucide-react";
import API from "@/api/axios";
import { TweetThreadDetail } from "./TweetThreadDetail";
import { getProperImageUrl } from "@/utils/imageUtils";
import { useAuth } from "@/context/AuthContext";
import { timeAgo } from "@/utils/timeAgo";

// ─── Types ───────────────────────────────────────────────────────────────────

type MediaType = "image" | "video" | null;
type TweetType = "tweet" | "repost";

interface TweetMediaItem {
  media: string;
  media_type: MediaType;
}

interface TweetCardProps {
    tweet_id:number;
  content: string;
  created_at: string;
  user_name: string;
  display_name: string;
  profile_image: string | null;
  media: string | null;
  media_type: MediaType;
  media_items?: TweetMediaItem[];
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
  onDelete?: (tweetId: number) => void;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

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
  media_items = [],
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
  onDelete,
}: TweetCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showThread,setShowThread] = useState(false);
  const [focusComment, setFocusComment] = useState(false);
  const [liked, setLiked] = useState<boolean>(isLiked);
  const [retweeted, setRetweeted] = useState<boolean>(isRetweeted);
  const [likes, setLikes] = useState<number>(like_count);
  const [retweets, setRetweets] = useState<number>(retweet_count);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const canDelete = type === "tweet" && user?.user_name === user_name;

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

  const handleDelete = async (): Promise<void> => {
    if (!canDelete || isDeleting) return;

    const confirmed = window.confirm("Delete this tweet?");
    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await API.delete(`/tweets/${tweet_id}`);
      onDelete?.(tweet_id);
    } catch (error) {
      setDeleteError("Failed to delete tweet");
      console.error("Failed to delete tweet:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const mediaItems =
    media_items.length > 0
      ? media_items
      : media
        ? [{ media, media_type }]
        : [];

  const initials: string = (display_name || user_name || "?")[0].toUpperCase();

  return (
    <>
    <Card onClick={()=>{setShowThread(true)}} className="cursor-pointer border-neutral-200 p-4 shadow-sm transition-colors hover:bg-neutral-50">
      {/* Repost label */}
      {type === "repost" && (
        <div className="mb-2 ml-10 flex items-center gap-1 text-xs font-medium text-neutral-500">
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
          className="transition-opacity hover:opacity-80"
        >
          <Avatar>
            {profile_image && (
              <AvatarImage src={getProperImageUrl(profile_image) || ""} alt={display_name} />
            )}
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
          <div className="flex items-baseline gap-1 flex-wrap min-w-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${user_name}`);
              }}
              className="text-base font-semibold text-neutral-950 hover:underline"
            >
              {display_name || user_name}
            </button>
            <span className="text-sm text-neutral-500">@{user_name}</span>
            <span className="text-sm text-neutral-300">·</span>
            <span className="text-sm text-neutral-500">{timeAgo(created_at)}</span>
          </div>
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              title="Delete tweet"
              aria-label="Delete tweet"
            >
              <Trash2 size={15} />
            </button>
          )}
          </div>

          {deleteError && (
            <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-2 text-xs font-medium text-red-600">
              {deleteError}
            </div>
          )}

          {/* Content */}
          <p className="mt-2 break-words text-[15px] leading-6 text-neutral-800">
            {content}
          </p>

          {/* Media */}
          {mediaItems.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {mediaItems.map((item, index) => {
                const itemUrl = getMediaUrl(item.media);
                const isVideo = item.media_type === "video";

                if (!itemUrl) return null;

                return (
                  <div
                    key={`${item.media}-${index}`}
                    className={`overflow-hidden rounded-2xl border border-neutral-200 ${
                      mediaItems.length === 1 ? "col-span-2" : ""
                    }`}
                  >
                    {isVideo ? (
                      <video
                        src={itemUrl}
                        className="h-64 w-full object-cover"
                        controls
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <img
                        src={itemUrl}
                        alt="tweet media"
                        className="h-64 w-full object-cover hover:brightness-95 transition-all duration-300"
                        onError={(e) => {
                          console.error("Failed to load image:", itemUrl);
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex justify-between border-t border-neutral-100 pt-3 text-xs font-semibold text-neutral-500">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowThread(true);
                setFocusComment(true);
                onComment?.();
              }}
              className="flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <MessageCircle size={14} />
              <span>Comment</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRetweet();
              }}
              className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-green-50 ${
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
              className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-red-50 ${
                liked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <Heart size={14} fill={liked ? "currentColor" : "none"} />
              <span>{likes > 0 ? likes : "Like"}</span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
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
          media_items={mediaItems}
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
