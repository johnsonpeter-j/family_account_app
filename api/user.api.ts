import apiClient from './client';
import tokenStorage, { TOKEN_KEY } from './tokenStorage';
import { AuthUser, MessageResponse } from './types';

export interface UpdateProfilePayload {
  name: string;
  phoneNo: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: AuthUser;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userApi = {
  updateProfile: async (payload: UpdateProfilePayload) => {
    const { data } = await apiClient.put<UpdateProfileResponse>('/users/profile', payload);
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const { data } = await apiClient.put<MessageResponse>('/users/change-password', payload);
    return data;
  },

  uploadProfilePhoto: async (formData: FormData) => {
    const token = await tokenStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = {
      'Content-Type': 'multipart/form-data',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const { data } = await apiClient.post<UpdateProfileResponse>('/users/profile/photo', formData, {
      headers,
    });
    return data;
  },
};


