import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { userApi } from "@/api/userApi";
import { getProperImageUrl } from "@/utils/imageUtils";

interface UserCardProps {
  user_id: number;
  user_name: string;
  display_name: string;
  profile_image?: string | null;
  bio?: string;
  isFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function UserCard({
  user_id,
  user_name,
  display_name,
  profile_image,
  bio,
  isFollowing = false,
  onFollowChange,
}: UserCardProps) {
  const navigate = useNavigate();
  const [following, setFollowing] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const initials = (display_name || user_name || "?")[0].toUpperCase();

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      if (following) {
        await userApi.unfollowUser(user_id);
      } else {
        await userApi.followUser(user_id);
      }
      const newFollowingStatus = !following;
      setFollowing(newFollowingStatus);
      onFollowChange?.(newFollowingStatus);
    } catch (err) {
      console.error("Failed to update follow status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/profile/${user_name}`)}
      className="cursor-pointer rounded-2xl border border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-50"
    >
      <div className="flex gap-3">
        <Avatar className="h-11 w-11 flex-shrink-0">
          {profile_image && <AvatarImage src={getProperImageUrl(profile_image) || ""} alt={display_name} />}
          <AvatarFallback className="text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-950">
                {display_name || user_name}
              </p>
              <p className="truncate text-xs text-neutral-500">@{user_name}</p>
            </div>
            <button
              onClick={handleFollowToggle}
              disabled={isLoading}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                following
                  ? "border-neutral-200 bg-white text-neutral-950 hover:bg-red-50 hover:text-red-600"
                  : "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800"
              } disabled:opacity-50`}
            >
              {following ? "Following" : "Follow"}
            </button>
          </div>

          {bio && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
              {bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
