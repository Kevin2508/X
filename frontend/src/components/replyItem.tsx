import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getProperImageUrl } from "@/utils/imageUtils";

interface Reply {
  comment_id: number;
  display_name?: string;
  user_name: string;
  profile_image?: string;
  created_at: string;
  content: string;
}

interface ReplyItemProps {
  reply: Reply;
}

export function ReplyItem({ reply }: ReplyItemProps) {
  const navigate = useNavigate();
  const initials = (reply.display_name || reply.user_name || "?")[0].toUpperCase();

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


  return (
    <div className="border-2 border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-white transition-colors duration-300 ml-6">
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/profile/${reply.user_name}`)}
          className="hover:opacity-80 transition-opacity duration-200"
        >
          <Avatar className="w-8 h-8 border-2 border-gray-300 flex-shrink-0">
            {reply.profile_image && (
              <AvatarImage src={getProperImageUrl(reply.profile_image) || ""} alt={reply.display_name} />
            )}
            <AvatarFallback className="font-black text-xs bg-yellow-100">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/profile/${reply.user_name}`)}
              className="font-bold uppercase text-xs hover:underline transition-all duration-200"
            >
              {reply.display_name || reply.user_name}
            </button>
            <span className="text-gray-500 text-xs">@{reply.user_name}</span>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-gray-500 text-xs">{timeAgo(reply.created_at)}</span>
          </div>

          <p className="text-xs font-bold mt-1 break-words leading-relaxed">
            {reply.content}
          </p>

          <div className="flex gap-3 mt-2">
           
          </div>
        </div>
      </div>
    </div>
  );
}