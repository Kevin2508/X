import API from "@/api/axios";
import { useState } from "react";

export function useTweets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createTweet = async ({
    content,
    image,
  }: {
    content: string;
    image?: File;
  }) => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("file", image);
      }
      const res = await API.post("/tweets/", formData, {
        headers: {
          "Content-Type": "multipart/from-data",
        },
      });
      return res;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to post tweet";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTweets = async()=>{
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/feed/");
      
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to post tweet";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }
  return { createTweet, getTweets, loading, error };
}
