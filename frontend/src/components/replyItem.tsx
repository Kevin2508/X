import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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

interface ReplyItemProps {
  reply: Reply;
}

export function ReplyItem({ reply }: ReplyItemProps) {
  const navigate = useNavigate();
  const initials = (reply.display_name || reply.user_name || "?")[0].toUpperCase();

  return (
    <div className="ml-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 transition-colors hover:bg-white">
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/profile/${reply.user_name}`)}
          className="hover:opacity-80 transition-opacity duration-200"
        >
          <Avatar className="h-8 w-8 flex-shrink-0">
            {reply.profile_image && (
              <AvatarImage src={getProperImageUrl(reply.profile_image) || ""} alt={reply.display_name} />
            )}
            <AvatarFallback className="text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/profile/${reply.user_name}`)}
              className="text-xs font-semibold text-neutral-950 hover:underline"
            >
              {reply.display_name || reply.user_name}
            </button>
            <span className="text-xs text-neutral-500">@{reply.user_name}</span>
            <span className="text-xs text-neutral-300">·</span>
            <span className="text-xs text-neutral-500">{timeAgo(reply.created_at)}</span>
          </div>

          <p className="mt-1 break-words text-xs leading-5 text-neutral-700">
            {reply.content}
          </p>

          <div className="flex gap-3 mt-2">
           
          </div>
        </div>
      </div>
    </div>
  );
}
