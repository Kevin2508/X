import type { User, Tweet, Comment } from '../types';

export const dummyUsers: User[] = [
  {
    user_id: 1,
    display_name: 'Sarah Johnson',
    user_name: 'sarahjohnson',
    email: 'sarah@example.com',
    profile_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'Designer, artist & coffee enthusiast ☕',
    is_verified: true,
    followers_count: 1542,
    following_count: 234,
    created_at: '2023-01-15T10:30:00Z',
  },
  {
    user_id: 2,
    display_name: 'Alex Developer',
    user_name: 'alexdev',
    email: 'alex@example.com',
    profile_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Full-stack developer | Open source enthusiast',
    is_verified: true,
    followers_count: 2890,
    following_count: 450,
    created_at: '2022-06-20T14:20:00Z',
  },
  {
    user_id: 3,
    display_name: 'Emma Wilson',
    user_name: 'emmawilson',
    email: 'emma@example.com',
    profile_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    bio: 'Tech writer & UX researcher',
    is_verified: false,
    followers_count: 567,
    following_count: 234,
    created_at: '2023-03-10T09:15:00Z',
  },
  {
    user_id: 4,
    display_name: 'Marcus Tech',
    user_name: 'marcustech',
    email: 'marcus@example.com',
    profile_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    bio: 'AI/ML Engineer | Tech Speaker',
    is_verified: true,
    followers_count: 5600,
    following_count: 890,
    created_at: '2022-02-05T11:40:00Z',
  },
  {
    user_id: 5,
    display_name: 'Lisa Chen',
    user_name: 'lisachen',
    email: 'lisa@example.com',
    profile_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    bio: 'Product manager | Always learning',
    is_verified: false,
    followers_count: 1200,
    following_count: 456,
    created_at: '2023-05-22T13:25:00Z',
  },
];

export const dummyTweets: Tweet[] = [
  {
    tweet_id: 1,
    user_id: 1,
    user: dummyUsers[0],
    content: 'Just finished an amazing design project! So excited to share it with everyone next week. The new UI framework makes everything so much smoother! 🎨✨',
    media: [],
    likes_count: 342,
    retweets_count: 89,
    comments_count: 23,
    is_liked: false,
    is_retweeted: false,
    created_at: '2024-04-28T10:30:00Z',
  },
  {
    tweet_id: 2,
    user_id: 2,
    user: dummyUsers[1],
    content: 'Hot take: TypeScript is the best thing that happened to JavaScript. Fight me in the replies 😂',
    media: [],
    likes_count: 1203,
    retweets_count: 456,
    comments_count: 189,
    is_liked: true,
    is_retweeted: false,
    created_at: '2024-04-27T15:45:00Z',
  },
  {
    tweet_id: 3,
    user_id: 3,
    user: dummyUsers[2],
    content: 'Writing a comprehensive guide on UX best practices. What topics should I cover? Drop your suggestions below! 👇',
    media: [],
    likes_count: 567,
    retweets_count: 234,
    comments_count: 78,
    is_liked: false,
    is_retweeted: true,
    created_at: '2024-04-26T12:00:00Z',
  },
  {
    tweet_id: 4,
    user_id: 4,
    user: dummyUsers[3],
    content: 'Excited to announce that our new ML model improved accuracy by 23%! Check out the research paper in our GitHub. #MachineLearning #AI',
    media: [],
    likes_count: 2345,
    retweets_count: 890,
    comments_count: 156,
    is_liked: false,
    is_retweeted: false,
    created_at: '2024-04-25T09:20:00Z',
  },
  {
    tweet_id: 5,
    user_id: 5,
    user: dummyUsers[4],
    content: 'Quick tip: Always validate user input on both client and server side. Security shouldn\'t be an afterthought! 🔒',
    media: [],
    likes_count: 890,
    retweets_count: 345,
    comments_count: 67,
    is_liked: false,
    is_retweeted: false,
    created_at: '2024-04-24T16:30:00Z',
  },
];

export const dummyComments: Comment[] = [
  {
    comment_id: 1,
    user_id: 2,
    user: dummyUsers[1],
    tweet_id: 1,
    content: 'This looks amazing! Would love to see the full process. Great work! 🙌',
    replies: [],
    likes_count: 45,
    is_liked: false,
    created_at: '2024-04-28T11:15:00Z',
  },
  {
    comment_id: 2,
    user_id: 3,
    user: dummyUsers[2],
    tweet_id: 1,
    content: 'The color palette is chef\'s kiss! Seriously impressive design.',
    replies: [],
    likes_count: 38,
    is_liked: true,
    created_at: '2024-04-28T12:30:00Z',
  },
  {
    comment_id: 3,
    user_id: 1,
    user: dummyUsers[0],
    tweet_id: 2,
    content: 'Couldn\'t agree more! TypeScript has saved me from so many bugs. Highly recommend for any team!',
    replies: [
      {
        comment_id: 31,
        user_id: 2,
        user: dummyUsers[1],
        tweet_id: 2,
        parent_comment_id: 3,
        content: '@sarahjohnson Right? And the intellisense support is unmatched.',
        replies: [],
        likes_count: 12,
        is_liked: false,
        created_at: '2024-04-27T16:45:00Z',
      },
    ],
    likes_count: 102,
    is_liked: false,
    created_at: '2024-04-27T16:20:00Z',
  },
];

export const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const posted = new Date(date);
  const seconds = Math.floor((now.getTime() - posted.getTime()) / 1000);

  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return posted.toLocaleDateString();
};

export const getCurrentUser = (): User => {
  return {
    user_id: 999,
    display_name: 'You',
    user_name: 'youruser',
    email: 'you@example.com',
    profile_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
    bio: 'Welcome to X Clone! Share your thoughts here.',
    is_verified: false,
    followers_count: 0,
    following_count: 0,
    created_at: '2024-04-01T00:00:00Z',
  };
};
