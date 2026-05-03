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
    <div className="border-b border-neutral-200 bg-white">
      <div className="relative h-44 overflow-hidden bg-neutral-100 sm:h-52">
        {user.cover_image && (
          <img
            src={getProperImageUrl(user.cover_image) || ""}
            alt="cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      <div className="relative px-4 sm:px-6">
        <div className="mb-4 flex items-end gap-4">
          <div className="-mt-16 relative z-10">
            <Avatar className="h-28 w-28 border-4 border-white shadow-sm sm:h-32 sm:w-32">
              {user.profile_image && (
                <AvatarImage src={getProperImageUrl(user.profile_image) || ""} alt={user.display_name} />
              )}
              <AvatarFallback className="text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="ml-auto mb-4">
            {isOwnProfile ? (
              <button
                onClick={onEditProfile}
                className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-50"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={onFollow}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                  isFollowing
                    ? "border-neutral-200 bg-white text-neutral-950 hover:bg-red-50 hover:text-red-600"
                    : "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        <div className="pb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
              {user.display_name || user.user_name}
            </h1>
            {user.is_verified && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                ✓
              </div>
            )}
          </div>
          <p className="text-sm text-neutral-500">@{user.user_name}</p>

          {/* Bio */}
          {user.bio && (
            <p className="mt-3 text-base leading-7 text-neutral-800">
              {user.bio}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-500">
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
          <div className="mt-4 flex gap-6 border-t border-neutral-100 pt-3">
            <div className="cursor-pointer transition-colors hover:text-neutral-950">
              <span className="text-lg font-semibold">{tweetsCount}</span>
              <span className="ml-1 text-sm text-neutral-500">
                {tweetsCount === 1 ? "Post" : "Posts"}
              </span>
            </div>

            <div className="cursor-pointer transition-colors hover:text-neutral-950">
              <span className="text-lg font-semibold">{following}</span>
              <span className="ml-1 text-sm text-neutral-500">
                Following
              </span>
            </div>

            <div className="cursor-pointer transition-colors hover:text-neutral-950">
              <span className="text-lg font-semibold">{followers}</span>
              <span className="ml-1 text-sm text-neutral-500">
                {followers === 1 ? "Follower" : "Followers"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
