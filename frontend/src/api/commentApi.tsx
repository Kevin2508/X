import API from "./axios";

export const commentApi = {
  createComment: async (tweet_id: number, content: string) => {
    const response = await API.post(`interaction/${tweet_id}/comment`, {
      comment: content,
    });
    return response.data;
  },
  createReply: async (comment_id: number, content: string) => {
    const response = await API.post(`/interaction/${comment_id}/reply`, {
      comment: content,
    });
    return response.data;
  },
  getComments: async (tweet_id: number) => {
    const response = await API.get(`/interaction/${tweet_id}/comment`);
    return response.data;
  },

  likeComment: async (comment_id: number) => {
    const response = await API.post(`/interaction/${comment_id}/comment/like`);
    return response.data;
  },

  // Unlike a comment
  dislikeComment: async (comment_id: number) => {
    const response = await API.delete(
      `/interaction/${comment_id}/comment/like`,
    );
    return response.data;
  },
};
