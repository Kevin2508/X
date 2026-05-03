import API from "@/api/axios";
import type { AxiosError } from "axios";
import { useState } from "react";

interface CreateTweetPayload {
  content: string;
  image?: File;
}

interface ApiErrorResponse {
  message?: string;
}

export function useTweets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createTweet = async ({ content, image }: CreateTweetPayload) => {
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
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err: unknown) {
      const message =
        (err as AxiosError<ApiErrorResponse>).response?.data?.message ||
        "Failed to post tweet";
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
    } catch (err: unknown) {
      const message =
        (err as AxiosError<ApiErrorResponse>).response?.data?.message ||
        "Failed to fetch tweets";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }
  return { createTweet, getTweets, loading, error };
}
