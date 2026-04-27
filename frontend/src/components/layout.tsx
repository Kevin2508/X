import React from "react";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <main className="min-h-screen bg-white text-black">
        {children}
      </main>
    </div>
  );
}
