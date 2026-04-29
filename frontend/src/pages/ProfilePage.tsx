import { useState } from 'react';
import { MapPin, Calendar, Link as LinkIcon, MoreHorizontal, MessageCircle } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import TweetCard from '../components/TweetCard';
import { dummyUsers, dummyTweets } from '../lib/dummyData';
import { useRouter } from '../context/routerContext';
import { useAuth } from '../context/authContext';

export default function ProfilePage() {
  const { pageParams } = useRouter();
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  // Get profile user or current user
  const profileUserId = pageParams?.userId || user?.user_id;
  const profileUser = dummyUsers.find((u) => u.user_id === profileUserId) || dummyUsers[0];
  
  // Get user's tweets
  const userTweets = dummyTweets.filter((t) => t.user_id === profileUser.user_id);

  const isOwnProfile = profileUserId === user?.user_id;

  return (
    <MainLayout>
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur bg-black/80 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-900 rounded-full">←</button>
          <div>
            <h2 className="text-xl font-bold">{profileUser.display_name}</h2>
            <p className="text-gray-500 text-sm">{userTweets.length} posts</p>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-48 bg-linear-to-r from-blue-600 to-purple-600" />

      {/* Profile Info */}
      <div className="border-b border-gray-700 pb-4">
        <div className="px-4">
          {/* Avatar and Actions */}
          <div className="flex justify-between items-end -mt-16 mb-4">
            <img
              src={profileUser.profile_image}
              alt={profileUser.display_name}
              className="w-32 h-32 rounded-full border-4 border-black"
            />
            <div className="flex gap-2">
              {isOwnProfile ? (
                <button className="px-4 py-2 border border-gray-700 text-white rounded-full font-bold hover:bg-gray-900">
                  Edit profile
                </button>
              ) : (
                <>
                  <button className="p-2 border border-gray-700 rounded-full hover:bg-gray-900">
                    <MoreHorizontal size={18} />
                  </button>
                  <button className="p-2 border border-gray-700 rounded-full hover:bg-gray-900">
                    <MessageCircle size={18} />
                  </button>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-2 rounded-full font-bold transition-colors ${
                      isFollowing
                        ? 'border border-gray-700 hover:border-red-500 hover:text-red-500'
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name & Handle */}
          <div className="mb-3">
            <h2 className="text-2xl font-bold">{profileUser.display_name}</h2>
            <p className="text-gray-500">@{profileUser.user_name}</p>
          </div>

          {/* Bio */}
          {profileUser.bio && <p className="text-white mb-4">{profileUser.bio}</p>}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-4">
            {profileUser.bio && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>Location</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Joined {new Date(profileUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            </div>
            {profileUser.bio && (
              <div className="flex items-center gap-1">
                <LinkIcon size={16} />
                <span>website.com</span>
              </div>
            )}
          </div>

          {/* Follow Stats */}
          <div className="flex gap-6 text-sm">
            <div className="hover:underline cursor-pointer">
              <span className="font-bold text-white">{profileUser.following_count}</span>
              <span className="text-gray-500"> Following</span>
            </div>
            <div className="hover:underline cursor-pointer">
              <span className="font-bold text-white">{profileUser.followers_count}</span>
              <span className="text-gray-500"> Followers</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mt-4">
          <button className="flex-1 px-4 py-3 font-bold text-center border-b-2 border-blue-500 hover:bg-gray-900/50">
            Posts
          </button>
          <button className="flex-1 px-4 py-3 text-gray-500 text-center hover:bg-gray-900/50">
            Replies
          </button>
          <button className="flex-1 px-4 py-3 text-gray-500 text-center hover:bg-gray-900/50">
            Likes
          </button>
        </div>
      </div>

      {/* User's Tweets */}
      <div>
        {userTweets.length > 0 ? (
          userTweets.map((tweet) => <TweetCard key={tweet.tweet_id} tweet={tweet} />)
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts yet</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
