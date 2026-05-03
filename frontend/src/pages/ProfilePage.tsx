import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/api/userApi";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileTabs } from "@/components/ProfileTabs";
import { UserTweets } from "@/components/UserTweets";
import { EditProfileModal } from "@/components/EditProfileModal";
import { RightPanel } from "@/components/RightPanel";
import { Loader2, ArrowLeft } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50">
        <Loader2 className="mb-4 animate-spin text-neutral-950" size={40} />
        <p className="font-medium text-neutral-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50">
        <p className="mb-4 text-xl font-semibold text-red-600">{error || "User not found"}</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-neutral-950 px-6 py-2 font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,680px)_320px]">
      <div className="hidden border-r border-neutral-200 bg-white p-4 md:block">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-full px-4 py-2 font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Profile Content */}
      <main className="max-h-screen overflow-y-auto border-x border-neutral-200 bg-white pb-20 md:pb-0">
        <div className="flex items-center gap-2 border-b border-neutral-200 p-4 md:hidden">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 transition-colors hover:bg-neutral-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="font-semibold text-neutral-950">{user.display_name || user.user_name}</p>
            <p className="text-xs text-neutral-500">{tweetsCount} Posts</p>
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
      </main>

      {/* Right Sidebar - Coming Soon */}
      <div className="hidden lg:block">
        <RightPanel />
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
      <MobileBottomNav />
    </div>
  );
}
