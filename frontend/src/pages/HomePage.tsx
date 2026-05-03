import { Navbar } from "@/components/Navbar";
import { RightPanel } from "@/components/RightPanel";
import Sidebar  from "@/components/Sidebar";
import { TweetForm } from "@/components/TweetForm";
import { TweetList } from "@/components/TweetList";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,680px)_320px]">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="min-w-0 border-x border-neutral-200 bg-white pb-20 md:pb-0">
        <Navbar />
        <div className="space-y-4 p-3 sm:p-4">
          <TweetForm />
          <TweetList />
        </div>
      </main>

      <div className="hidden lg:block">
        <RightPanel />
      </div>
      <MobileBottomNav />
    </div>
  );
}
