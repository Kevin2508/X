import { useState, useRef, useEffect } from "react";
import { X, Heart, MessageCircle, Repeat2, Share, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { commentApi } from "@/api/commentApi";
import { CommentItem } from "./CommentItem";
import { getProperImageUrl } from "@/utils/imageUtils";

type MediaType = "image" | "video" | null;

interface Reply {
  comment_id: number;
  user_name: string;
  display_name: string;
  profile_image: string;
  created_at: string;
  content: string;
}

interface Comment {
  comment_id: number;
  user_name: string;
  display_name: string;
  profile_image: string;
  created_at: string;
  content: string;
  replies?: Reply[];
}

interface TweetThreadDetailProps {
  tweet_id: number;
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
  focusComment?: boolean;
  onClose: () => void;
}

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

  if (mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
    return mediaPath;
  }

  if (mediaPath.includes("uploads")) {
    const filename = mediaPath.split(/[\\/]/).pop();
    if (filename) {
      const apiBase = "http://localhost:3000";
      return `${apiBase}/uploads/${filename}`;
    }
  }

  return null;
}

export function TweetThreadDetail({
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
  focusComment = false,
  onClose,
}: TweetThreadDetailProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(like_count);
  const [retweeted, setRetweeted] = useState(isRetweeted);
  const [retweets, setRetweets] = useState(retweet_count);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaUrl = getMediaUrl(media);

  const initials = (display_name || user_name || "?")[0].toUpperCase();

  // Auto-focus comment textarea when opened from comment button
  useEffect(() => {
    fetchComments();
    if (focusComment && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [focusComment, tweet_id]);

  // Fetch comments function
  const fetchComments = async () => {
    try {
      const data = await commentApi.getComments(tweet_id);

      const mappedComments = data.map((comment: any) => ({
        comment_id: comment.id || comment.comment_id,
        user_name: comment.user_name,
        display_name: comment.display_name,
        profile_image: comment.profile_image,
        created_at: comment.created_at,
        content: comment.content,
        replies: (comment.replies || []).map((reply: any) => ({
          comment_id: reply.id || reply.comment_id,
          user_name: reply.user_name,
          display_name: reply.display_name,
          profile_image: reply.profile_image,
          created_at: reply.created_at,
          content: reply.content,
          parent_comment_id: reply.parent_comment_id || null,
        })),
      }));
      setComments(mappedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleReply = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await commentApi.createComment(tweet_id, newComment);
      await fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(newLiked ? likes + 1 : likes - 1);
    // TODO: Call API to like tweet
  };

  const handleRetweet = async () => {
    const newRetweeted = !retweeted;
    setRetweeted(newRetweeted);
    setRetweets(newRetweeted ? retweets + 1 : retweets - 1);
    // TODO: Call API to retweet
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl border-2 border-black shadow-2xl overflow-hidden flex flex-col animate-in scale-in-95">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-black px-6 py-4 flex justify-between items-center">
          <h2 className="font-black text-lg uppercase tracking-wider">
            Tweet Thread
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X size={24} className="font-bold" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          <div className="p-6 space-y-6">
            {/* Main Tweet */}
            <div className="border-2 border-black rounded-xl p-6 bg-white hover:shadow-lg transition-shadow duration-300">
              <div className="flex gap-4">
                <Avatar className="w-14 h-14 border-2 border-black flex-shrink-0">
                  {profile_image && (
                    <AvatarImage src={getProperImageUrl(profile_image) || ""} alt={display_name} />
                  )}
                  <AvatarFallback className="font-black text-base bg-blue-100">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black uppercase text-base">
                      {display_name || user_name}
                    </span>
                    <span className="text-gray-500 text-sm">@{user_name}</span>
                    <span className="text-gray-400 text-lg">·</span>
                    <span className="text-gray-500 text-sm">
                      {timeAgo(created_at)}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-base font-bold mt-3 break-words leading-relaxed">
                    {content}
                  </p>

                  {/* Media */}
                  {media && media_type === "image" && mediaUrl && (
                    <img
                      src={mediaUrl}
                      alt="tweet"
                      className="mt-4 rounded-xl border-2 border-black w-full max-h-96 object-cover hover:brightness-95 transition-all duration-300"
                      onError={(e) => {
                        console.error("Failed to load image:", mediaUrl);
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}

                  {/* Stats */}
                  <div className="flex gap-6 mt-5 pt-4 border-t-2 border-black text-sm font-bold">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-xs uppercase">
                        Reposts
                      </span>
                      <span className="text-lg font-black">{retweets}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-xs uppercase">
                        Likes
                      </span>
                      <span className="text-lg font-black">{likes}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-5 pt-4 border-t-2 border-black">
                    <button
                      onClick={() => {
                        setTimeout(() => {
                          textareaRef.current?.focus();
                          textareaRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }, 100);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 font-bold uppercase text-sm hover:scale-105 active:scale-95 text-blue-600 shadow-md"
                    >
                      <MessageCircle size={18} />
                      Reply
                    </button>
                    <button
                      onClick={handleRetweet}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-lg font-bold uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                        retweeted
                          ? "border-green-500 bg-green-50 text-green-600"
                          : "border-black hover:bg-green-50"
                      }`}
                    >
                      <Repeat2 size={18} />
                      Repost
                    </button>
                    <button
                      onClick={handleLike}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-lg font-bold uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                        liked
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-black hover:bg-red-50"
                      }`}
                    >
                      <Heart size={18} fill={liked ? "currentColor" : "none"} />
                      Like
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200" />

            {/* Add Comment Section */}
            <div
              className={`border-2 rounded-xl p-5 transition-all duration-300 ${
                focusComment
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-black bg-gray-50 hover:bg-white"
              }`}
            >
              <div className="flex gap-3">
                <Avatar className="w-11 h-11 border-2 border-black flex-shrink-0">
                  <AvatarFallback className="font-black bg-purple-100">
                    YOU
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="What's your reply? Add context..."
                    maxLength={280}
                    className="w-full border-2 border-black rounded-lg p-3 font-bold resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition-all duration-200 bg-white"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500 font-bold">
                      {newComment.length}/280
                    </span>
                    <button
                      onClick={handleReply}
                      disabled={!newComment.trim() || isSubmitting}
                      className="px-5 py-2 bg-black text-white font-black rounded-lg hover:bg-gray-800 transition-all duration-200 uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      {isSubmitting && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="font-black uppercase text-lg tracking-wider mb-4 flex items-center gap-2">
                <MessageCircle size={20} />
                {comments.length} Replies
              </h3>

              {comments.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-black transition-colors duration-300">
                  <MessageCircle
                    size={40}
                    className="mx-auto text-gray-300 mb-3"
                  />
                  <p className="text-gray-500 font-bold">
                    No replies yet. Be the first to reply!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <CommentItem 
                      key={comment.comment_id} 
                      comment={comment}
                      onCommentRefresh={fetchComments}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Comment Item Component ───
