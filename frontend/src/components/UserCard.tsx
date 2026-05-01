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
      className="border-2 border-gray-300 rounded-xl p-4 hover:border-black transition-all duration-300 hover:shadow-lg cursor-pointer hover:bg-gray-50 bg-white"
    >
      <div className="flex gap-3">
        <Avatar className="w-12 h-12 border-2 border-gray-300 flex-shrink-0">
          {profile_image && <AvatarImage src={getProperImageUrl(profile_image) || ""} alt={display_name} />}
          <AvatarFallback className="font-black text-sm bg-blue-100">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="min-w-0">
              <p className="font-bold uppercase text-sm truncate">
                {display_name || user_name}
              </p>
              <p className="text-gray-500 text-xs truncate">@{user_name}</p>
            </div>
            <button
              onClick={handleFollowToggle}
              disabled={isLoading}
              className={`px-3 py-1 text-xs font-bold rounded-full border-2 transition-all duration-200 whitespace-nowrap ${
                following
                  ? "bg-white text-black border-black hover:bg-red-50"
                  : "bg-black text-white border-black hover:bg-gray-800"
              } disabled:opacity-50`}
            >
              {following ? "Following" : "Follow"}
            </button>
          </div>

          {bio && (
            <p className="text-xs font-bold text-gray-600 line-clamp-2 mt-1">
              {bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
