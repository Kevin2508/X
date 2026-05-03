import API from "./axios";

export const userApi = {
  getAllUsers: async () => {
    const response = await API.get("/users");
    return response.data;
  },

  // Get current user profile
  getMe: async () => {
    const response = await API.get("/users/me");
    return response.data;
  },

  // Get user by ID
  getUserById: async (user_id: number) => {
    const response = await API.get(`/users/${user_id}`);
    return response.data;
  },

  // Get user by username
  getUserByUsername: async (user_name: string) => {
    const response = await API.get(`/users/username/${user_name}`);
    return response.data;
  },

  // Get user's tweets
  getUserTweets: async (user_id: number) => {
    const response = await API.get(`/tweets/user/${user_id}`);
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData: {
    display_name?: string;
    bio?: string;
    country?: string;
  }) => {
    const response = await API.put("/users/me", profileData);
    return response.data;
  },

  // Update profile picture
  updateProfilePic: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await API.put("/users/me/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update cover image
  updateCoverImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await API.put("/users/me/cover-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Follow user
  followUser: async (followee_id: number) => {
    const response = await API.post(`/follows/${followee_id}`);
    return response.data;
  },

  // Unfollow user
  unfollowUser: async (followee_id: number) => {
    const response = await API.delete(`/follows/${followee_id}`);
    return response.data;
  },

  // Get followers
  getFollowers: async (user_id: number) => {
    const response = await API.get(`/follows/${user_id}/followers`);
    return response.data;
  },

  // Get following
  getFollowing: async (user_id: number) => {
    const response = await API.get(`/follows/${user_id}/following`);
    return response.data;
  },

  // Check if following
  checkFollowing: async (followee_id: number) => {
    const response = await API.get(`/follows/check/${followee_id}`);
    return response.data;
  },
};
