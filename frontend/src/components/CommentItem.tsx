import { ChevronDown, ChevronUp, Loader2, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commentApi } from "@/api/commentApi";
import { ReplyItem } from "./replyItem";
import { getProperImageUrl } from "@/utils/imageUtils";
import { timeAgo } from "@/utils/timeAgo";

interface Reply {
  comment_id: number;
  display_name?: string;
  user_name: string;
  profile_image?: string;
  created_at: string;
  content: string;
}
interface Comment {
  comment_id: number;
  display_name?: string;
  user_name: string;
  profile_image?: string;
  created_at: string;
  content: string;
  replies?:Reply[];
}

interface CommentItemProps {
  comment: Comment;
  onCommentRefresh?: () => void;
}

export function CommentItem({ comment, onCommentRefresh }: CommentItemProps) {
  const navigate = useNavigate();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies] = useState<Reply[]>(comment.replies || []);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const initials = (comment.display_name || comment.user_name || "?")[0].toUpperCase();

 const handleSubmitReply = async()=>{
    if(!replyText.trim())return;
    setIsSubmittingReply(true);
    try {
        await commentApi.createReply(comment.comment_id,replyText);
        setReplyText("");
        setShowReplyInput(false);
        onCommentRefresh?.();
    } catch (error) {
      console.error("Failed to create reply:", error);
    } finally {
      setIsSubmittingReply(false);
    }
 }
 const toggleShowReplies = () => {
    setShowReplies(!showReplies);
  };
  const toggleReplyInput = () => {
    setShowReplyInput(!showReplyInput);
    if (!showReplyInput) {
      setTimeout(() => replyInputRef.current?.focus(), 100);
    }
  };
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 transition-colors hover:bg-neutral-50">
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/profile/${comment.user_name}`)}
          className="hover:opacity-80 transition-opacity duration-200"
        >
          <Avatar className="h-10 w-10 flex-shrink-0">
            {comment.profile_image && (
              <AvatarImage src={getProperImageUrl(comment.profile_image) || ""} alt={comment.display_name} />
            )}
            <AvatarFallback className="text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/profile/${comment.user_name}`)}
              className="text-sm font-semibold text-neutral-950 hover:underline"
            >
              {comment.display_name || comment.user_name}
            </button>
            <span className="text-xs text-neutral-500">@{comment.user_name}</span>
            <span className="text-xs text-neutral-300">·</span>
            <span className="text-xs text-neutral-500">{timeAgo(comment.created_at)}</span>
          </div>

          <p className="mt-2 break-words text-sm leading-6 text-neutral-700">
            {comment.content}
          </p>

          {/* Action Buttons */}
          <div className="mt-3 flex gap-4 border-t border-neutral-100 pt-2">
            <button
              onClick={toggleReplyInput}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-blue-600"
            >
              <MessageCircle size={14} />
              Reply
            </button>

           
            {replies.length > 0 && (
              <button
                onClick={toggleShowReplies}
                className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-purple-500 transition-all duration-200"
              >
                {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border-2 border-blue-400">
              <textarea
                ref={replyInputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                maxLength={280}
                className="w-full border-2 border-blue-300 rounded-lg p-2 text-xs font-bold resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                rows={2}
              />
              <div className="flex items-center justify-between mt-2 gap-2">
                <span className="text-xs text-gray-500 font-bold">
                  {replyText.length}/280
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReplyInput(false)}
                    className="px-3 py-1 text-xs font-bold text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim() || isSubmittingReply}
                    className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {isSubmittingReply && <Loader2 size={12} className="animate-spin" />}
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Show Replies */}
          {showReplies && replies.length > 0 && (
            <div className="mt-3 space-y-2">
              {replies.map((reply) => (
                <ReplyItem key={reply.comment_id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
