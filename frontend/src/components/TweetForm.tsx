import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";

export function TweetForm() {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea placeholder="What's happening?" />
          <div className="flex justify-end">
            <Button>Tweet</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}