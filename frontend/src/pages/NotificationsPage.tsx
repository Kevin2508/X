import { Heart, MessageCircle, Repeat2, Users } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import { dummyUsers } from '../lib/dummyData';
import { useRouter } from '../context/routerContext';
import type { Notification } from '../types';

const dummyNotifications: Notification[] = [
  {
    notification_id: 1,
    user_id: 999,
    actor_id: 2,
    actor: dummyUsers[1],
    notification_type: 'like',
    content: '@alexdev liked your tweet',
    is_read: false,
    created_at: '2024-04-28T10:30:00Z',
  },
  {
    notification_id: 2,
    user_id: 999,
    actor_id: 3,
    actor: dummyUsers[2],
    notification_type: 'comment',
    content: '@emmawilson replied to your tweet',
    is_read: false,
    created_at: '2024-04-28T09:15:00Z',
  },
  {
    notification_id: 3,
    user_id: 999,
    actor_id: 1,
    actor: dummyUsers[0],
    notification_type: 'retweet',
    content: '@sarahjohnson retweeted your tweet',
    is_read: true,
    created_at: '2024-04-27T15:45:00Z',
  },
  {
    notification_id: 4,
    user_id: 999,
    actor_id: 4,
    actor: dummyUsers[3],
    notification_type: 'follow',
    content: '@marcustech started following you',
    is_read: true,
    created_at: '2024-04-27T12:30:00Z',
  },
  {
    notification_id: 5,
    user_id: 999,
    actor_id: 5,
    actor: dummyUsers[4],
    notification_type: 'like',
    content: '@lisachen liked your tweet',
    is_read: true,
    created_at: '2024-04-26T18:20:00Z',
  },
];

const notificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart size={18} className="text-red-500" />;
    case 'comment':
      return <MessageCircle size={18} className="text-blue-500" />;
    case 'retweet':
      return <Repeat2 size={18} className="text-green-500" />;
    case 'follow':
      return <Users size={18} className="text-blue-500" />;
    default:
      return null;
  }
};

export default function NotificationsPage() {
  const { navigate } = useRouter();

  return (
    <MainLayout>
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur bg-black/80 border-b border-gray-700 px-4 py-3">
        <h2 className="text-xl font-bold">Notifications</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button className="flex-1 px-4 py-3 font-bold text-center border-b-2 border-blue-500 hover:bg-gray-900/50">
          All
        </button>
        <button className="flex-1 px-4 py-3 text-gray-500 text-center hover:bg-gray-900/50">
          Verified
        </button>
        <button className="flex-1 px-4 py-3 text-gray-500 text-center hover:bg-gray-900/50">
          Mentions
        </button>
      </div>

      {/* Notifications List */}
      <div>
        {dummyNotifications.length > 0 ? (
          dummyNotifications.map((notification) => (
            <div
              key={notification.notification_id}
              onClick={() => {
                if (notification.notification_type === 'follow') {
                  navigate('profile', { userId: notification.actor_id });
                }
              }}
              className={`border-b border-gray-700 p-4 hover:bg-gray-900/50 transition-colors cursor-pointer ${
                !notification.is_read ? 'bg-gray-900/30' : ''
              }`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="shrink-0 mt-1">{notificationIcon(notification.notification_type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <img
                      src={notification.actor.profile_image}
                      alt={notification.actor.display_name}
                      className="w-12 h-12 rounded-full"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold hover:underline">{notification.actor.display_name}</h4>
                        {notification.actor.is_verified && (
                          <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.16 16.5L4.5 11.84l-1.06 1.06L9.16 18.62l10.54-10.54-1.06-1.06z" />
                          </svg>
                        )}
                        <span className="text-gray-500">@{notification.actor.user_name}</span>
                      </div>

                      <p className="text-gray-500 text-sm">{notification.content}</p>

                      {notification.notification_type === 'follow' && (
                        <button className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full font-bold hover:bg-blue-700 transition-colors">
                          Follow back
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Unread Indicator */}
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-3" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No notifications yet</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
