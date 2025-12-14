export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface Sweet {
  _id: string; // MongoDB uses _id
  name: string;
  category: string;
  price: number;
  quantity: number;
}

// This is the missing part that caused your error
export interface AuthResponse {
  token: string;
  user: User;
}