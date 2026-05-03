import { ChevronDown, ChevronUp, Loader2, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commentApi } from "@/api/commentApi";
import { ReplyItem } from "./replyItem";
import { getProperImageUrl } from "@/utils/imageUtils";

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

  function timeAgo(created_at: string): string {
    const now = new Date();
    const createdDate = new Date(created_at);
    const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    if (seconds < 60) return "now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

    return createdDate.toLocaleDateString();
  }

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
    <div className="border-2 border-gray-300 rounded-xl p-4 hover:border-black transition-all duration-300 hover:shadow-md bg-white">
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/profile/${comment.user_name}`)}
          className="hover:opacity-80 transition-opacity duration-200"
        >
          <Avatar className="w-10 h-10 border-2 border-gray-300 flex-shrink-0 hover:border-black transition-colors duration-300">
            {comment.profile_image && (
              <AvatarImage src={getProperImageUrl(comment.profile_image) || ""} alt={comment.display_name} />
            )}
            <AvatarFallback className="font-black text-xs bg-green-100">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/profile/${comment.user_name}`)}
              className="font-bold uppercase text-sm hover:underline transition-all duration-200"
            >
              {comment.display_name || comment.user_name}
            </button>
            <span className="text-gray-500 text-xs">@{comment.user_name}</span>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-gray-500 text-xs">{timeAgo(comment.created_at)}</span>
          </div>

          <p className="text-sm font-bold mt-2 break-words leading-relaxed">
            {comment.content}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-3 pt-2 border-t border-gray-200">
            <button
              onClick={toggleReplyInput}
              className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-blue-500 transition-all duration-200 hover:scale-110 active:scale-95"
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
