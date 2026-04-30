import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";

export function TweetCard({ name = "Kevin", content = "This is a sample tweet UI" }) {
  return (
    <Card className="p-4 comic-card comic-shadow">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback className="font-black uppercase text-lg">{name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-black uppercase text-base">{name}</div>
          <p className="text-black text-sm font-bold mt-2">{content}</p>

          <div className="flex justify-between mt-4 text-xs font-black uppercase border-t-2 border-black pt-3">
            <span className="cursor-pointer hover:font-black">💬 Comment</span>
            <span className="cursor-pointer hover:font-black">🔁 Retweet</span>
            <span className="cursor-pointer hover:font-black">❤️ Like</span>
          </div>
        </div>
      </div>
    </Card>
  );
}