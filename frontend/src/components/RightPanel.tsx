import { Card } from "./ui/card";
import { Input } from "./ui/input";

export function RightPanel() {
  return (
    <div className="p-4 space-y-4 border-l-2 border-black">
      <Input placeholder="Search..." className="comic-input border-2 border-black font-black uppercase" />
      <Card className="p-4 comic-card comic-shadow border-2 border-black">
        <h2 className="font-black text-xl uppercase tracking-wider border-b-2 border-black pb-2 mb-3">TRENDS</h2>
        <div className="space-y-2 font-black uppercase">
          <p className="text-sm cursor-pointer hover:underline">#React</p>
          <p className="text-sm cursor-pointer hover:underline">#Flutter</p>
          <p className="text-sm cursor-pointer hover:underline">#AI</p>
        </div>
      </Card>
    </div>
  );
}