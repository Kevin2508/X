import { useRef, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useTweets } from "@/hooks/useTweets";
import { ImagePlus, X } from "lucide-react";
interface TweetFormProps{
  onTweetCreated?:(tweet:any)=>void;
}
export function TweetForm({ onTweetCreated }: TweetFormProps) {
  const { user } = useAuth();
  const { createTweet, loading, error } = useTweets();

  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [mediaError, setMediaError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetMedia = () => {
    setFiles([]);
    setMediaError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((currentFiles) => currentFiles.filter((_, fileIndex) => fileIndex !== index));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const nextFiles = [...files, ...selectedFiles].slice(0, 5);
    const videoCount = nextFiles.filter((file) => file.type.startsWith("video")).length;
    const oversizedFile = nextFiles.find((file) => file.size > 25 * 1024 * 1024);

    if (selectedFiles.length + files.length > 5) {
      setMediaError("You can attach up to 5 media files.");
      e.target.value = "";
      return;
    }

    if (videoCount > 1) {
      setMediaError("Only one video can be added to a tweet.");
      e.target.value = "";
      return;
    }

    if (oversizedFile) {
      setMediaError("Each media file must be 25MB or smaller.");
      e.target.value = "";
      return;
    }

    setMediaError("");
    setFiles(nextFiles);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) return;
    try {
      const newTweet = await createTweet({ content, files });

      if (newTweet) {
        setContent("");
        resetMedia();
                      
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
    <Card className="border-neutral-200 p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>
            {(user?.display_name || user?.user_name || "U")[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="What's happening?"
            className="min-h-28 resize-none border-0 bg-neutral-50 text-base focus-visible:ring-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {files.map((file, index) => {
                const previewUrl = URL.createObjectURL(file);
                const isVideo = file.type.startsWith("video");

                return (
                  <div key={`${file.name}-${index}`} className="relative overflow-hidden rounded-2xl border border-neutral-200">
                    {isVideo ? (
                      <video
                        src={previewUrl}
                        className="h-40 w-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm"
                      aria-label="Remove media"
                    >
                      <X size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        {(error || mediaError) && (
          <p className="text-sm font-medium text-red-600">{error || mediaError}</p>
        )}

        <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
          >
            <ImagePlus size={18} />
            Media
          </button>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            ref={fileInputRef}
            onChange={handleMediaChange}
            className="hidden"
          />

          <div className="flex justify-end">
            <Button
              className="px-5"
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && files.length === 0)}
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
