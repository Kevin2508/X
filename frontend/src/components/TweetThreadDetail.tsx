import { useState, useRef, useEffect } from "react";
import { X, Heart, MessageCircle, Repeat2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { commentApi } from "@/api/commentApi";
import { CommentItem } from "./CommentItem";
import { getProperImageUrl } from "@/utils/imageUtils";
import { timeAgo } from "@/utils/timeAgo";

type MediaType = "image" | "video" | null;

interface TweetMediaItem {
  media: string;
  media_type: MediaType;
}

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
  media_items?: TweetMediaItem[];
  like_count: number;
  retweet_count: number;
  isLiked: boolean;
  isRetweeted: boolean;
  focusComment?: boolean;
  onClose: () => void;
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
  media_items = [],
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
  const mediaItems =
    media_items.length > 0
      ? media_items
      : media
        ? [{ media, media_type }]
        : [];

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4 backdrop-blur-sm animate-in fade-in"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl animate-in scale-in-95">
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
            Tweet Thread
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-neutral-100"
          >
            <X size={24} className="font-bold" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          <div className="p-6 space-y-6">
            {/* Main Tweet */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex gap-4">
                <Avatar className="h-14 w-14 flex-shrink-0">
                  {profile_image && (
                    <AvatarImage src={getProperImageUrl(profile_image) || ""} alt={display_name} />
                  )}
                  <AvatarFallback className="text-base">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-semibold text-neutral-950">
                      {display_name || user_name}
                    </span>
                    <span className="text-sm text-neutral-500">@{user_name}</span>
                    <span className="text-lg text-neutral-300">·</span>
                    <span className="text-sm text-neutral-500">
                      {timeAgo(created_at)}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="mt-3 break-words text-base leading-7 text-neutral-800">
                    {content}
                  </p>

                  {/* Media */}
                  {mediaItems.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
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
                                className="max-h-96 w-full object-cover"
                                controls
                              />
                            ) : (
                              <img
                                src={itemUrl}
                                alt="tweet"
                                className="max-h-96 w-full object-cover hover:brightness-95 transition-all duration-300"
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

                  {/* Stats */}
                  <div className="mt-5 flex gap-6 border-t border-neutral-100 pt-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-500">
                        Reposts
                      </span>
                      <span className="text-lg font-semibold">{retweets}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-500">
                        Likes
                      </span>
                      <span className="text-lg font-semibold">{likes}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 flex gap-3 border-t border-neutral-100 pt-4">
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
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-blue-100 bg-blue-50 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      <MessageCircle size={18} />
                      Reply
                    </button>
                    <button
                      onClick={handleRetweet}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition-colors ${
                        retweeted
                          ? "border-green-100 bg-green-50 text-green-600"
                          : "border-neutral-200 hover:bg-green-50"
                      }`}
                    >
                      <Repeat2 size={18} />
                      Repost
                    </button>
                    <button
                      onClick={handleLike}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition-colors ${
                        liked
                          ? "border-red-100 bg-red-50 text-red-600"
                          : "border-neutral-200 hover:bg-red-50"
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
              className={`rounded-2xl border p-5 transition-colors ${
                focusComment
                  ? "border-blue-200 bg-blue-50"
                  : "border-neutral-200 bg-neutral-50 hover:bg-white"
              }`}
            >
              <div className="flex gap-3">
                <Avatar className="h-11 w-11 flex-shrink-0">
                  <AvatarFallback>
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
                    className="w-full resize-none rounded-2xl border border-neutral-200 bg-white p-3 text-sm focus:outline-none focus:ring-4 focus:ring-neutral-950/5"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-neutral-500">
                      {newComment.length}/280
                    </span>
                    <button
                      onClick={handleReply}
                      disabled={!newComment.trim() || isSubmitting}
                      className="flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-950">
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
