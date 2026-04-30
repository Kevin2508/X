import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";

export function TweetCard({ name = "Kevin", content = "This is a sample tweet UI" }) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold">{name}</div>
          <p className="text-gray-700 text-sm">{content}</p>

          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span className="cursor-pointer">💬 Comment</span>
            <span className="cursor-pointer">🔁 Retweet</span>
            <span className="cursor-pointer">❤️ Like</span>
          </div>
        </div>
      </div>
    </Card>
  );
}