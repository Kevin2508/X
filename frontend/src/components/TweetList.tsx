import { TweetCard } from "./TweetCard";

export function TweetList() {
  return (
    <div className="space-y-4 mt-4">
      <TweetCard />
      <TweetCard name="John" content="Hello world!" />
      <TweetCard name="Alice" content="Building my twitter 🚀" />
    </div>
  );
}