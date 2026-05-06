import { handleLogout } from '../auth';

export const authInterceptor = (statusCode: number) => {
  if (statusCode == 401) {
    handleLogout();
  }
};
