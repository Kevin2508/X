import { useRef, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useTweets } from "@/hooks/useTweets";
interface TweetFormProps{
  onTweetCreated?:(tweet:any)=>void;
}
export function TweetForm({ onTweetCreated }: TweetFormProps) {
  const { user } = useAuth();
  const { createTweet, loading, error } = useTweets();

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file)); // show image preview instantly
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      const newTweet = await createTweet({ content, image: image ?? undefined });

      if (newTweet) {
        setContent("");
        removeImage();
                      
        // Call callback if provided
        if (onTweetCreated) {
          onTweetCreated(newTweet);
        }
      }
    } catch (err: unknown) {
      console.log(err);
    }
  };
  return (
    <Card className="p-4 comic-card comic-shadow border-2 border-black">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback className="font-black uppercase text-lg">
            {(user?.display_name || user?.user_name || "U")[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="What's happening?"
            className="comic-input resize-none border-2 border-black"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {/* Image Preview */}
        {preview && (
          <div className="relative w-fit">
            <img
              src={preview}
              alt="preview"
              className="max-h-60 rounded-xl object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs"
            >
              ✕
            </button>
          </div>
        )}
        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Bottom Bar */}
        <div className="flex items-center justify-between border-t pt-3">
          {/* Image Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-400 text-sm"
          >
            📷 Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex justify-end">
            <Button
              className="comic-btn"
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
      </div>
    </Card>
  );
}
