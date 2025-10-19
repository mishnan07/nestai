import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const userApi = {
  createProfile: async (data: any) => {
    return await api.post('/users/profile', data);
  },

  getProfile: async (cognitoSub: string) => {
    return await api.get(`/users/profile/${cognitoSub}`);
  },

  updateProfile: async (cognitoSub: string, data: any) => {
    return await api.patch(`/users/profile/${cognitoSub}`, data);
  },

  verifyPhone: async (cognitoSub: string) => {
    return await api.patch(`/users/verify-phone/${cognitoSub}`);
  },
};

export default api;