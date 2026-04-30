import { Navbar } from "@/components/Navbar";
import { RightPanel } from "@/components/RightPanel";
import { Sidebar } from "@/components/Sidebar";
import { TweetForm } from "@/components/TweetForm";
import { TweetList } from "@/components/TweetList";

export function HomePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:block md:col-span-1 border-r">
        <Sidebar />
      </div>

      {/* Feed */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 border-r">
        <Navbar />
        <div className="p-4 space-y-4">
          <TweetForm />
          <TweetList />
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:block lg:col-span-1">
        <RightPanel />
      </div>
    </div>
  );
}
