import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, Calendar } from "lucide-react";
import { getProperImageUrl } from "@/utils/imageUtils";

interface UserProfileData {
  user_id: number;
  user_name: string;
  display_name: string;
  profile_image: string | null;
  cover_image: string | null;
  bio: string | null;
  country: string | null;
  created_at: string;
  is_verified: number | boolean;
}

interface ProfileHeaderProps {
  user: UserProfileData;
  isOwnProfile: boolean;
  followers: number;
  following: number;
  tweetsCount: number;
  isFollowing?: boolean;
  onFollow?: () => void;
  onEditProfile?: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function ProfileHeader({
  user,
  isOwnProfile,
  followers,
  following,
  tweetsCount,
  isFollowing = false,
  onFollow,
  onEditProfile,
}: ProfileHeaderProps) {
  const initials = (user.display_name || user.user_name || "?")[0].toUpperCase();

  return (
    <div className="bg-white border-b-2 border-black">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 border-b-2 border-black relative overflow-hidden">
        {user.cover_image && (
          <img
            src={getProperImageUrl(user.cover_image) || ""}
            alt="cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/5 hover:bg-black/10 transition-all duration-300" />
      </div>

      {/* Profile Info */}
      <div className="px-4 py-0 relative">
        {/* Profile Picture */}
        <div className="flex items-end gap-4 mb-4">
          <div className="-mt-16 relative z-10">
            <Avatar className="w-32 h-32 border-4 border-black shadow-lg">
              {user.profile_image && (
                <AvatarImage src={getProperImageUrl(user.profile_image) || ""} alt={user.display_name} />
              )}
              <AvatarFallback className="font-black text-3xl bg-purple-200">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Action Button */}
          <div className="ml-auto mb-4">
            {isOwnProfile ? (
              <button
                onClick={onEditProfile}
                className="px-6 py-2 bg-black text-white font-black rounded-full border-2 border-black hover:bg-white hover:text-black transition-all duration-200 hover:scale-105 active:scale-95 uppercase text-sm"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={onFollow}
                className={`px-6 py-2 font-black rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95 uppercase text-sm ${
                  isFollowing
                    ? "bg-white text-black border-black hover:bg-red-50"
                    : "bg-black text-white border-black hover:bg-gray-800"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="pb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-black text-2xl uppercase tracking-wider">
              {user.display_name || user.user_name}
            </h1>
            {user.is_verified && (
              <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                ✓
              </div>
            )}
          </div>
          <p className="text-gray-500 font-bold">@{user.user_name}</p>

          {/* Bio */}
          {user.bio && (
            <p className="text-base font-bold mt-3 leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 mt-3 text-sm font-bold text-gray-600">
            {user.country && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                {user.country}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              Joined {formatDate(user.created_at)}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-3 border-t-2 border-gray-200">
            <div className="cursor-pointer hover:text-purple-600 transition-colors duration-200">
              <span className="font-black text-lg">{tweetsCount}</span>
              <span className="text-gray-500 text-sm font-bold ml-1">
                {tweetsCount === 1 ? "Post" : "Posts"}
              </span>
            </div>

            <div className="cursor-pointer hover:text-blue-600 transition-colors duration-200">
              <span className="font-black text-lg">{following}</span>
              <span className="text-gray-500 text-sm font-bold ml-1">
                Following
              </span>
            </div>

            <div className="cursor-pointer hover:text-pink-600 transition-colors duration-200">
              <span className="font-black text-lg">{followers}</span>
              <span className="text-gray-500 text-sm font-bold ml-1">
                {followers === 1 ? "Follower" : "Followers"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
