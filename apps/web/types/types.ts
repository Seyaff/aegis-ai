// 1. Core Models
export type User = {
  _id: string;
  name: string;
  role: string;
  email: string;
  username: string; // Fixed the typo "usernname" here!
  createdAt: Date;
  updatedAt: Date;
};

// 2. The Generic Wrapper
// 'T' acts as a placeholder for whatever specific data payload your backend returns
export type ApiResponse<T = null> = {
  success: boolean;
  message: string;
  data?: T; // Using a standard key name like 'data' is common practice
};

// Alternatively, if your backend literally uses the key "user" for auth requests,
// you can write it like this to preserve the exact key structure:
export type AuthResponse<T> = {
  success: boolean;
  message: string;
  user: T;
};

// 3. Request Payloads (Keep these explicit since fields differ)
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
};

// 4. Refactored Response Types using the Generic
export type LoginResponse = AuthResponse<User>;
export type RegisterResponse = AuthResponse<User>;