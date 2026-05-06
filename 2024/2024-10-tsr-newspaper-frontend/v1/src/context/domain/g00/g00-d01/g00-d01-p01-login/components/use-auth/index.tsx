// hooks/useAuth.ts
import { useState } from 'react';
import { LoginCredentials, LoginSuccessResponse } from '../../types/auth';
import { loginApi } from '@domain/g00/g00-d01/local/api/rest-api/log-in'; // ✅ เรียก API ที่แยกไว้

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    credentials: LoginCredentials,
  ): Promise<LoginSuccessResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginApi(credentials);
      return data;
    } catch (err) {
      setError('อีเมล/ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
