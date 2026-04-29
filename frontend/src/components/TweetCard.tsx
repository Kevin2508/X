import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import type { Tweet } from '../types';
import { formatTimeAgo } from '../lib/dummyData';
import { useRouter } from '../context/routerContext';

interface TweetCardProps {
  tweet: Tweet;
  onLike?: (tweetId: number) => void;
}

export default function TweetCard({ tweet, onLike }: TweetCardProps) {
  const { navigate } = useRouter();

  return (
    <article className="border-b border-gray-700 p-4 hover:bg-gray-900/50 transition-colors cursor-pointer group">
      <div className="flex gap-3">
        {/* Avatar */}
        <img
          src={tweet.user.profile_image}
          alt={tweet.user.display_name}
          className="w-12 h-12 rounded-full"
        />

        {/* Content */}
        <div
          className="flex-1 min-w-0"
          onClick={() => navigate('post-detail', { tweetId: tweet.tweet_id })}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-base text-white hover:underline">
              {tweet.user.display_name}
            </h3>
            {tweet.user.is_verified && (
              <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.16 16.5L4.5 11.84l-1.06 1.06L9.16 18.62l10.54-10.54-1.06-1.06z" />
              </svg>
            )}
            <span className="text-gray-500 text-sm">@{tweet.user.user_name}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{formatTimeAgo(tweet.created_at)}</span>
          </div>

          {/* Tweet Content */}
          <p className="text-base text-white mb-3 whitespace-pre-wrap overflow-wrap break-word">
            {tweet.content}
          </p>

          {/* Media Preview */}
          {tweet.media && tweet.media.length > 0 && (
            <div className="rounded-2xl overflow-hidden mb-3 bg-gray-900">
              <img
                src={tweet.media[0].media}
                alt="tweet media"
                className="w-full object-cover max-h-80"
              />
            </div>
          )}

          {/* Interactions */}
          <div className="flex justify-between text-gray-500 max-w-md text-sm mt-3 group-hover:text-white/50">
            {/* Comments */}
            <div className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <div className="p-2 rounded-full hover:bg-blue-500/10">
                <MessageCircle size={16} />
              </div>
              {tweet.comments_count > 0 && (
                <span className="text-xs">{tweet.comments_count}</span>
              )}
            </div>

            {/* Retweets */}
            <div className="flex items-center gap-2 hover:text-green-500 transition-colors">
              <div className="p-2 rounded-full hover:bg-green-500/10">
                <Repeat2 size={16} />
              </div>
              {tweet.retweets_count > 0 && (
                <span className="text-xs">{tweet.retweets_count}</span>
              )}
            </div>

            {/* Likes */}
            <div
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(tweet.tweet_id);
              }}
            >
              <div
                className={`p-2 rounded-full hover:bg-red-500/10 ${
                  tweet.is_liked ? 'text-red-500' : ''
                }`}
              >
                <Heart size={16} fill={tweet.is_liked ? 'currentColor' : 'none'} />
              </div>
              {tweet.likes_count > 0 && <span className="text-xs">{tweet.likes_count}</span>}
            </div>

            {/* Share */}
            <div className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <div className="p-2 rounded-full hover:bg-blue-500/10">
                <Share size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
