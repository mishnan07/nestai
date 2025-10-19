export interface User {
  id: string;
  cognitoSub: string;
  email: string;
  name: string;
  phoneNumber: string;
  state: string;
  city: string;
  role: 'lawyer' | 'student' | 'citizen';
  phoneVerified: boolean;
  emailVerified: boolean;
}

export interface SignupData {
  name: string;
  phoneNumber: string;
  state: string;
  city: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface LoginData {
  emailOrPhone: string;
  password: string;
}