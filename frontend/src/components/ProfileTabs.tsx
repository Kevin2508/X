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
    <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <div className="flex gap-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 border-b-2 px-2 py-4 text-sm font-semibold transition-colors hover:bg-neutral-50 sm:px-4 ${
                isActive
                  ? "border-neutral-950 bg-white text-neutral-950"
                  : "border-transparent text-neutral-500 hover:text-neutral-950"
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
