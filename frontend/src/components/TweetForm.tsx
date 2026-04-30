import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";

export function TweetForm() {
  return (
    <Card className="p-4 comic-card comic-shadow border-2 border-black">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback className="font-black uppercase text-lg">U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea placeholder="What's happening?" className="comic-input resize-none border-2 border-black" />
          <div className="flex justify-end">
            <Button className="comic-btn">TWEET</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}