import { Heart, MessageCircle } from 'lucide-react';
import type { Comment } from '../types';
import { formatTimeAgo } from '../lib/dummyData';

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: number) => void;
  onLike?: (commentId: number) => void;
}

export default function CommentItem({ comment, onReply, onLike }: CommentItemProps) {
  return (
    <>
      {/* Main Comment */}
      <div className="border-b border-gray-700 p-4 hover:bg-gray-900/50 transition-colors">
        <div className="flex gap-3">
          {/* Avatar */}
          <img
            src={comment.user.profile_image}
            alt={comment.user.display_name}
            className="w-10 h-10 rounded-full shrink-0"
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm hover:underline">{comment.user.display_name}</h4>
              {comment.user.is_verified && (
                <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.16 16.5L4.5 11.84l-1.06 1.06L9.16 18.62l10.54-10.54-1.06-1.06z" />
                </svg>
              )}
              <span className="text-gray-500 text-sm">@{comment.user.user_name}</span>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-xs">{formatTimeAgo(comment.created_at)}</span>
            </div>

            {/* Comment Text */}
            <p className="text-white text-sm mt-1 whitespace-pre-wrap overflow-wrap break-word">
              {comment.content}
            </p>

            {/* Actions */}
            <div className="flex gap-8 mt-3 text-gray-500 text-xs">
              <button
                onClick={() => onReply?.(comment.comment_id)}
                className="hover:text-blue-500 flex items-center gap-1 group"
              >
                <div className="p-1 group-hover:bg-blue-500/10 rounded-full">
                  <MessageCircle size={14} />
                </div>
              </button>

              <button
                onClick={() => onLike?.(comment.comment_id)}
                className={`flex items-center gap-1 group ${
                  comment.is_liked ? 'text-red-500' : 'hover:text-red-500'
                }`}
              >
                <div className="p-1 group-hover:bg-red-500/10 rounded-full">
                  <Heart size={14} fill={comment.is_liked ? 'currentColor' : 'none'} />
                </div>
                {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-4 border-l border-gray-700 ml-5">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.comment_id} comment={reply} onReply={onReply} onLike={onLike} />
          ))}
        </div>
      )}
    </>
  );
}
