"use client";

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Check if current page is a login page or admin/superadmin page
  const isLoginPage = pathname.includes('/login') || pathname.includes('/signin');
  const isAdminPage = pathname.startsWith('/admin');
  const isSuperAdminPage = pathname.startsWith('/superadmin');
  
  // Don't show footer on login pages, admin pages, and superadmin pages
  if (isLoginPage || isAdminPage || isSuperAdminPage) {
    return null;
  }
  
  return <Footer />;
}
