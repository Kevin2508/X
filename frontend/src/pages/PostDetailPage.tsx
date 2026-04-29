import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, Image as ImageIcon, Smile } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import { dummyTweets, dummyComments, formatTimeAgo } from '../lib/dummyData';
import { useRouter } from '../context/routerContext';
import { useAuth } from '../context/authContext';
import type { Comment } from '../types';

export default function PostDetailPage() {
  const { pageParams } = useRouter();
  const { user } = useAuth();
  const tweet = dummyTweets.find((t) => t.tweet_id === pageParams.tweetId) || dummyTweets[0];

  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [liked, setLiked] = useState(tweet.is_liked);
  const [likesCount, setLikesCount] = useState(tweet.likes_count);
  const [retweeted, setRetweeted] = useState(tweet.is_retweeted);

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      comment_id: Math.max(...comments.map((c) => c.comment_id), 0) + 1,
      user_id: user?.user_id || 999,
      user: {
        user_id: user?.user_id || 999,
        display_name: user?.display_name || 'You',
        user_name: user?.user_name || 'youruser',
        email: user?.email || 'you@example.com',
        profile_image: user?.profile_image,
        is_verified: false,
        followers_count: 0,
        following_count: 0,
        created_at: new Date().toISOString(),
      },
      tweet_id: tweet.tweet_id,
      content: commentText,
      parent_comment_id: replyTo || undefined,
      replies: [],
      likes_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setCommentText('');
    setReplyTo(null);
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <MainLayout>
      {/* Tweet Detail */}
      <div className="border-b border-gray-700">
        <div className="p-4 flex gap-4">
          <img src={tweet.user.profile_image} alt="" className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base">{tweet.user.display_name}</h3>
              {tweet.user.is_verified && (
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.16 16.5L4.5 11.84l-1.06 1.06L9.16 18.62l10.54-10.54-1.06-1.06z" />
                </svg>
              )}
              <span className="text-gray-500">@{tweet.user.user_name}</span>
            </div>

            <p className="text-white text-2xl font-bold mt-4 mb-4">{tweet.content}</p>

            {tweet.media && tweet.media.length > 0 && (
              <img src={tweet.media[0].media} alt="" className="rounded-2xl max-h-96 w-full mb-4" />
            )}

            <div className="text-gray-500 text-sm py-4 border-y border-gray-700">
              <p>{formatTimeAgo(tweet.created_at)}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 py-4 text-gray-500 text-sm border-b border-gray-700">
              <div className="hover:text-blue-500 cursor-pointer">
                <span className="font-bold text-white">{tweet.comments_count}</span> Comments
              </div>
              <div className="hover:text-green-500 cursor-pointer">
                <span className="font-bold text-white">{tweet.retweets_count}</span> Retweets
              </div>
              <div className="hover:text-red-500 cursor-pointer">
                <span className="font-bold text-white">{likesCount}</span> Likes
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between py-4 text-gray-500 px-8 border-b border-gray-700">
              <button className="hover:text-blue-500 hover:bg-blue-500/10 p-2 rounded-full transition-colors">
                <MessageCircle size={18} />
              </button>
              <button
                onClick={() => setRetweeted(!retweeted)}
                className={`hover:bg-green-500/10 p-2 rounded-full transition-colors ${
                  retweeted ? 'text-green-500' : 'hover:text-green-500'
                }`}
              >
                <Repeat2 size={18} />
              </button>
              <button
                onClick={toggleLike}
                className={`hover:bg-red-500/10 p-2 rounded-full transition-colors ${
                  liked ? 'text-red-500' : 'hover:text-red-500'
                }`}
              >
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              </button>
              <button className="hover:text-blue-500 hover:bg-blue-500/10 p-2 rounded-full transition-colors">
                <Share size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Compose */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex gap-4">
          <img
            src={user?.profile_image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=you'}
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            {replyTo && (
              <p className="text-gray-500 text-sm mb-2">
                Replying to <span className="text-blue-500">@{tweet.user.user_name}</span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="ml-2 text-xs hover:underline"
                >
                  Cancel
                </button>
              </p>
            )}
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Post a reply!"
              className="w-full text-lg bg-transparent text-white placeholder-gray-500 outline-none resize-none"
              rows={3}
            />

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2 text-blue-500">
                <button className="p-2 hover:bg-blue-500/10 rounded-full">
                  <ImageIcon size={18} />
                </button>
                <button className="p-2 hover:bg-blue-500/10 rounded-full">
                  <Smile size={18} />
                </button>
              </div>
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div>
        {comments.map((comment) => (
          <div key={comment.comment_id} className="border-b border-gray-700 p-4 hover:bg-gray-900/50">
            <div className="flex gap-3">
              <img src={comment.user.profile_image} alt="" className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold">{comment.user.display_name}</h4>
                  {comment.user.is_verified && (
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.16 16.5L4.5 11.84l-1.06 1.06L9.16 18.62l10.54-10.54-1.06-1.06z" />
                    </svg>
                  )}
                  <span className="text-gray-500">@{comment.user.user_name}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500 text-sm">{formatTimeAgo(comment.created_at)}</span>
                </div>

                <p className="text-white mt-2">{comment.content}</p>

                {/* Comment Actions */}
                <div className="flex gap-8 mt-3 text-gray-500 max-w-xs">
                  <button
                    onClick={() => setReplyTo(comment.comment_id)}
                    className="hover:text-blue-500 transition-colors text-sm hover:bg-blue-500/10 p-1 rounded"
                  >
                    Reply
                  </button>
                  <button className="hover:text-red-500 transition-colors text-sm hover:bg-red-500/10 p-1 rounded">
                    <Heart size={14} />
                  </button>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 ml-4 border-l border-gray-700 pl-4 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.comment_id} className="text-sm">
                        <div className="flex items-center gap-2">
                          <img
                            src={reply.user.profile_image}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-bold">{reply.user.display_name}</span>
                          <span className="text-gray-500">@{reply.user.user_name}</span>
                        </div>
                        <p className="text-gray-300 mt-1">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
