'use client';

import Sidebar from './Sidebar';
import AuthGuard from './AuthGuard';
import { Role } from '@/types';

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export default function AppLayout({ children, requiredRole }: AppLayoutProps) {
  return (
    <AuthGuard requiredRole={requiredRole}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
