
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  roles: string[];
  createdAt?: string;
}

//login, register, check status
export interface AuthResponse {
    user:  User;
    token: string;
}