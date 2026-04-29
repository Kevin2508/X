import { useState } from 'react';
import { Search } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import TweetCard from '../components/TweetCard';
import { dummyTweets, dummyUsers } from '../lib/dummyData';
import { useRouter } from '../context/routerContext';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { navigate } = useRouter();
  const [selectedTab, setSelectedTab] = useState<'top' | 'latest' | 'people'>('top');

  const filteredTweets = dummyTweets.filter((tweet) =>
    tweet.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = dummyUsers.filter(
    (user) =>
      user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur bg-black/80 border-b border-gray-700 px-4 py-3">
        <h2 className="text-xl font-bold">Explore</h2>
      </div>

      {/* Search Bar */}
      <div className="border-b border-gray-700 p-4 sticky top-16 z-20 bg-black/90 backdrop-blur">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search X"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-full pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {searchQuery ? (
        <>
          {/* Tabs for search results */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setSelectedTab('top')}
              className={`flex-1 px-4 py-3 font-bold text-center hover:bg-gray-900/50 ${
                selectedTab === 'top' ? 'border-b-2 border-blue-500' : ''
              }`}
            >
              Top
            </button>
            <button
              onClick={() => setSelectedTab('latest')}
              className={`flex-1 px-4 py-3 font-bold text-center hover:bg-gray-900/50 ${
                selectedTab === 'latest' ? 'border-b-2 border-blue-500' : ''
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSelectedTab('people')}
              className={`flex-1 px-4 py-3 font-bold text-center hover:bg-gray-900/50 ${
                selectedTab === 'people' ? 'border-b-2 border-blue-500' : ''
              }`}
            >
              People
            </button>
          </div>

          {/* Search Results */}
          <div>
            {selectedTab === 'people' ? (
              filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => navigate('profile', { userId: user.user_id })}
                    className="border-b border-gray-700 p-4 hover:bg-gray-900/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={user.profile_image}
                        alt={user.display_name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold hover:underline">{user.display_name}</h4>
                          {user.is_verified && (
                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9.16 16.5L4.5 11.84l-1.06 1.06L9.16 18.62l10.54-10.54-1.06-1.06z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-gray-500">@{user.user_name}</p>
                        {user.bio && <p className="text-white text-sm mt-1">{user.bio}</p>}
                        <p className="text-gray-500 text-sm mt-1">
                          <span className="font-bold text-white">{user.followers_count}</span> Followers
                        </p>
                      </div>
                      <button className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full font-bold hover:bg-blue-700 transition-colors shrink-0">
                        Follow
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No users found</p>
                </div>
              )
            ) : filteredTweets.length > 0 ? (
              filteredTweets.map((tweet) => <TweetCard key={tweet.tweet_id} tweet={tweet} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No tweets found</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Trending Section */}
          <div>
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-2xl font-bold mb-4">What's happening</h3>
            </div>

            {/* Trending Items */}
            {[
              { category: 'Technology', topic: 'TypeScript', tweets: '125K' },
              { category: 'Programming', topic: 'React', tweets: '89K' },
              { category: 'Web Development', topic: 'Frontend', tweets: '234K' },
              { category: 'Tech News', topic: 'AI & ML', tweets: '567K' },
              { category: 'Social', topic: 'JavaScript', tweets: '156K' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="border-b border-gray-700 p-4 hover:bg-gray-900/50 transition-colors cursor-pointer"
              >
                <div className="text-gray-500 text-xs font-bold mb-1">{item.category} · Trending</div>
                <h4 className="text-white font-bold text-lg hover:underline">{item.topic}</h4>
                <div className="text-gray-500 text-xs mt-2">{item.tweets} posts</div>
              </div>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
}
