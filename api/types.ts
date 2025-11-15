export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  createdAt: string;
  updatedAt: string;
  profilePhotoUrl: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface MessageResponse {
  message: string;
}


