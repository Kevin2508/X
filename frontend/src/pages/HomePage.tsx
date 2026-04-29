import { useState } from 'react';
import { Image, Smile, Search } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import TweetCard from '../components/TweetCard';
import { dummyTweets } from '../lib/dummyData';
import { useAuth } from '../context/authContext';

export default function HomePage() {
  const [tweetContent, setTweetContent] = useState('');
  const [tweets, setTweets] = useState(dummyTweets);
  const { user } = useAuth();

  const handleTweet = async () => {
    if (!tweetContent.trim()) return;

    // Simulate API call
    const newTweet = {
      tweet_id: Math.max(...tweets.map((t) => t.tweet_id)) + 1,
      user_id: user?.user_id || 999,
      user: {
        user_id: user?.user_id || 999,
        display_name: user?.display_name || 'You',
        user_name: user?.user_name || 'youruser',
        email: user?.email || 'you@example.com',
        profile_image: user?.profile_image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
        is_verified: false,
        followers_count: 0,
        following_count: 0,
        created_at: new Date().toISOString(),
      },
      content: tweetContent,
      media: [],
      likes_count: 0,
      retweets_count: 0,
      comments_count: 0,
      is_liked: false,
      is_retweeted: false,
      created_at: new Date().toISOString(),
    };

    setTweets([newTweet, ...tweets]);
    setTweetContent('');
  };

  const handleLike = (tweetId: number) => {
    setTweets(
      tweets.map((tweet) => {
        if (tweet.tweet_id === tweetId) {
          return {
            ...tweet,
            is_liked: !tweet.is_liked,
            likes_count: tweet.is_liked ? tweet.likes_count - 1 : tweet.likes_count + 1,
          };
        }
        return tweet;
      })
    );
  };

  return (
    <MainLayout>
      {/* Top Bar */}
      <div className="sticky top-0 z-30 backdrop-blur bg-black/80 border-b border-gray-700 px-4 py-3 flex items-center gap-4">
        <h2 className="text-xl font-bold flex-1">Home</h2>
        <button className="p-2 hover:bg-gray-900 rounded-full transition-colors">
          <Search size={20} />
        </button>
      </div>

      {/* Compose Tweet Section */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <img
            src={user?.profile_image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=you'}
            alt="Your avatar"
            className="w-12 h-12 rounded-full"
          />

          {/* Compose */}
          <div className="flex-1">
            <textarea
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
              placeholder="What's happening?!"
              className="w-full text-2xl bg-transparent text-white placeholder-gray-500 outline-none resize-none"
              rows={3}
            />

            {/* Actions */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
              <div className="flex gap-2 text-blue-500">
                <button className="p-2 hover:bg-blue-500/10 rounded-full transition-colors">
                  <Image size={20} />
                </button>
                <button className="p-2 hover:bg-blue-500/10 rounded-full transition-colors">
                  <Smile size={20} />
                </button>
              </div>

              <button
                onClick={handleTweet}
                disabled={!tweetContent.trim()}
                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tweets Feed */}
      <div>
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.tweet_id}
            tweet={tweet}
            onLike={handleLike}
          />
        ))}
      </div>
    </MainLayout>
  );
}
