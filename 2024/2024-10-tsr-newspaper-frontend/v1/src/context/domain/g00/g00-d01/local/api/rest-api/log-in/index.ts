
import { LoginCredentials ,LoginSuccessResponse } from '@domain/g00/g00-d01/g00-d01-p01-login/types/auth';
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export const loginApi = async (
  credentials: LoginCredentials,
): Promise<LoginSuccessResponse> => {
  const response = await fetch(`${BACKEND_URL}/login/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = (await response.json()) as LoginSuccessResponse;

  if (data.status_code !== 200) {
    throw new Error('Login failed');
  }

  return data;
};
