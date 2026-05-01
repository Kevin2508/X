import { MessageSquare, Heart, Image as ImageIcon, Bookmark } from "lucide-react";

interface ProfileTabsProps {
  activeTab: "posts" | "media" | "likes" | "bookmarks";
  onTabChange: (tab: "posts" | "media" | "likes" | "bookmarks") => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    { id: "posts", label: "Posts", icon: MessageSquare },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "likes", label: "Likes", icon: Heart },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  ];

  return (
    <div className="bg-white border-b-2 border-black sticky top-0 z-10">
      <div className="flex gap-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 border-b-4 font-black uppercase text-sm transition-all duration-200 hover:bg-gray-50 ${
                isActive
                  ? "border-black text-black bg-white"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
