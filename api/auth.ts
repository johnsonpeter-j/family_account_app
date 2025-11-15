import apiClient from './client';
import tokenStorage, { TOKEN_KEY } from './tokenStorage';
import {
  AuthResponse,
  ForgotPasswordPayload,
  MessageResponse,
  SignInPayload,
  SignUpPayload,
} from './types';

const persistToken = async (response: AuthResponse) => {
  if (response.token) {
    await tokenStorage.setItem(TOKEN_KEY, response.token);
  }
};

export const authApi = {
  signUp: async (payload: SignUpPayload) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/signup', payload);
    await persistToken(data);
    return data;
  },

  signIn: async (payload: SignInPayload) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/signin', payload);
    await persistToken(data);
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const { data } = await apiClient.post<MessageResponse>('/auth/forgot-password', payload);
    return data;
  },

  signOut: async () => {
    await tokenStorage.removeItem(TOKEN_KEY);
    const { data } = await apiClient.post<MessageResponse>('/auth/signout');
    return data;
  },

  verify: async () => {
    const { data } = await apiClient.get<AuthResponse>('/auth/verify');
    await persistToken(data);
    return data;
  },
};


