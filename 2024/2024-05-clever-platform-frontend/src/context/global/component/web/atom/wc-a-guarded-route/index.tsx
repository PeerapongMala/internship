import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

interface WCAGuardedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export default function WCAGuardedRoute({
  children,
  redirectPath,
}: WCAGuardedRouteProps) {
  const navigate = useNavigate();
  const { accessToken } = StoreGlobalPersist.StateGet(['accessToken']);

  useEffect(() => {
    // If no access token, redirect to the login page
    if (!accessToken) {
      // If a redirect path is provided, save it in the store to redirect after login
      if (redirectPath) {
        StoreGlobal.MethodGet().redirectUrlSet(redirectPath);
      }
      navigate({ to: '/login-id', replace: true });
    }
  }, []);

  return children;
}
