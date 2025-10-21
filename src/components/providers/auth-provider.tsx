"use client"

import { useEffect } from 'react';
import { AuthApiService } from "@/components/server-api-serivces/auth-api-service"
import { useRouter, usePathname } from 'next/navigation';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { refreshTokens } = AuthApiService();

  const publicRoutes = ['/login', '/signup'];
  const isPublic = publicRoutes.includes(pathname);

  useEffect(() => { 
    const checkAuth = async () => {
      const areTokensValid = await refreshTokens();
      // Redirect to login page if tokens are invalid
      if (!isPublic && !areTokensValid)
        return router.push('/login');
      // Redirect to home page if on a public page and tokens are valid
      else if (isPublic && areTokensValid)
        return router.push('/');
    };

    checkAuth();
  }, [pathname, isPublic, refreshTokens, router]);

  return <>{children}</>;
};
