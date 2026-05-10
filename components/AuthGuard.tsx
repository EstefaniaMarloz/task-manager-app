'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (requiredRole && role !== requiredRole) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, role, requiredRole, router]);

  if (!isAuthenticated) return null;
  if (requiredRole && role !== requiredRole) return null;

  return <>{children}</>;
}
