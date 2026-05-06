import { SignupForm } from '../../../../g00-d02-p01-signup/components/signup';

interface ApiResponse<T> {
  data?: T;
  message: string;
}

interface SignupResponse {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  company: string;
  branch: string;
  tax_id: string;
  phone: string;
  address: string;
  district: string;
  sub_district: string;
  province: string;
  postal_code: string;
  role_id: number;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export type ErrorField = 'email' | 'username' | 'submit';

export class AuthError extends Error {
  constructor(
    message: string,
    public field: ErrorField,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const signupUser = async (data: SignupForm): Promise<SignupResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/login/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, role_id: 2 }),
    });

    const result: ApiResponse<SignupResponse> = await response.json();

    if (!response.ok) {
      if (result.message.includes('users_email_key')) {
        throw new AuthError('อีเมลนี้ถูกใช้ไปแล้ว กรุณากรอกใหม่อีกครั้ง', 'email');
      }

      if (result.message.includes('users_username_key')) {
        throw new AuthError(
          'ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว กรุณากรอกใหม่อีกครั้ง',
          'username',
        );
      }
      console.error('Signup failed', result.message);
      throw new AuthError(result.message || 'Signup failed', 'submit');
    }

    return result.data!;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Network error. กรุณาลองใหม่อีกครั้ง.', 'submit');
  }
};
