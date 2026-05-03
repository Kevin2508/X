import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/api/userApi";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileTabs } from "@/components/ProfileTabs";
import { UserTweets } from "@/components/UserTweets";
import { EditProfileModal } from "@/components/EditProfileModal";
import { Loader2, ArrowLeft } from "lucide-react";

interface UserProfile {
  user_id: number;
  user_name: string;
  display_name: string;
  email: string;
  profile_image: string | null;
  cover_image: string | null;
  bio: string | null;
  country: string | null;
  date_of_birth: string | null;
  created_at: string;
  is_verified: number | boolean;
}

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "media" | "likes" | "bookmarks">("posts");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [tweetsCount, setTweetsCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwnProfile = currentUser?.user_name === username;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        if (!username) {
          setError("Username not provided");
          return;
        }

        const userResponse = await userApi.getUserByUsername(username);
        // Extract user from result array
        const userData = userResponse?.result?.[0];

        if (!userData) {
          setError("User not found");
          setLoading(false);
          return;
        }

        setUser(userData);

        // Fetch followers count
        try {
          const followersData = await userApi.getFollowers(userData.user_id);
          setFollowers(Array.isArray(followersData) ? followersData.length : 0);
        } catch (err) {
          console.error("Failed to fetch followers:", err);
        }

        // Fetch following count
        try {
          const followingData = await userApi.getFollowing(userData.user_id);
          setFollowing(Array.isArray(followingData) ? followingData.length : 0);
        } catch (err) {
          console.error("Failed to fetch following:", err);
        }

        // Fetch tweets count
        try {
          const tweetsData = await userApi.getUserTweets(userData.user_id);
          const tweets = Array.isArray(tweetsData) ? tweetsData : tweetsData?.result || [];
          setTweetsCount(tweets.length);
        } catch (err) {
          console.error("Failed to fetch tweets:", err);
        }

        // Check if following (only if not own profile)
        if (!isOwnProfile && currentUser) {
          try {
            const followStatus = await userApi.checkFollowing(userData.user_id);
            setIsFollowing(followStatus?.isFollowing || false);
          } catch (err) {
            console.error("Failed to check following status:", err);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, isOwnProfile, currentUser]);

  const handleFollow = async () => {
    if (!user) return;

    try {
      if (isFollowing) {
        await userApi.unfollowUser(user.user_id);
      } else {
        await userApi.followUser(user.user_id);
      }
      setIsFollowing(!isFollowing);
      setFollowers(isFollowing ? followers - 1 : followers + 1);
    } catch (err) {
      console.error("Failed to update follow status:", err);
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-black mb-4" size={48} />
        <p className="font-bold text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-red-500 font-bold text-xl mb-4">{error || "User not found"}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all duration-200"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
      {/* Sidebar - Back Button */}
      <div className="hidden md:block md:col-span-1 border-r-2 border-black p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-bold"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Profile Content */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 border-r-2 border-black max-h-screen overflow-y-auto">
        {/* Mobile Back Button */}
        <div className="md:hidden p-4 border-b-2 border-black flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="font-black uppercase">{user.display_name || user.user_name}</p>
            <p className="text-xs text-gray-500">{tweetsCount} Posts</p>
          </div>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          followers={followers}
          following={following}
          tweetsCount={tweetsCount}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onEditProfile={handleEditProfile}
        />

        {/* Tabs */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <UserTweets userId={user.user_id} tab={activeTab} />
      </div>

      {/* Right Sidebar - Coming Soon */}
      <div className="hidden lg:block lg:col-span-1 border-l-2 border-black p-6">
        <div className="bg-gray-50 border-2 border-black rounded-xl p-4 text-center">
          <p className="font-bold text-sm text-gray-600">Recommended Users Coming Soon</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isOwnProfile && user && (
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}
