import { UserPlus } from 'lucide-react';
import type { User } from '../types';
import { useRouter } from '../context/routerContext';
import { useState } from 'react';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const { navigate } = useRouter();

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  return (
    <div
      onClick={() => navigate('profile', { userId: user.user_id })}
      className="border-b border-gray-700 p-4 hover:bg-gray-900/50 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <img
            src={user.profile_image}
            alt={user.display_name}
            className="w-12 h-12 rounded-full shrink-0"
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="font-bold hover:underline">{user.display_name}</h4>
              {user.is_verified && (
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.16 16.5L4.5 11.84l-1.06 1.06L9.16 18.62l10.54-10.54-1.06-1.06z" />
                </svg>
              )}
            </div>
            <p className="text-gray-500 text-sm">@{user.user_name}</p>
            {user.bio && <p className="text-white text-sm mt-1 truncate">{user.bio}</p>}
          </div>
        </div>

        {/* Follow Button */}
        <button
          onClick={handleFollowClick}
          className={`ml-2 px-4 py-1.5 rounded-full font-bold text-sm transition-colors shrink-0 ${
            isFollowing
              ? 'border border-gray-700 text-white hover:border-red-500 hover:text-red-500'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {isFollowing ? (
            <span className="flex items-center gap-1">Following</span>
          ) : (
            <span className="flex items-center gap-1">
              <UserPlus size={14} />
              Follow
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
