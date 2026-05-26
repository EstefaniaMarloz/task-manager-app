'use client';

import Sidebar from './Sidebar';
import Footer from './Footer';
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
        <div className="flex-1 flex flex-col overflow-auto">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </AuthGuard>
  );
}
