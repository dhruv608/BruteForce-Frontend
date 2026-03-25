"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { isStudentToken } from '@/lib/auth-utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Home, BookOpen, PenTool, Trophy, Lock } from 'lucide-react';

export default function StudentHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Don't fetch profile for public profile routes
    if (pathname.startsWith('/profile/')) {
      return;
    }

    // Check if we have a student token before making API calls
    if (!isStudentToken()) {
      return; // Don't make API calls if not a student token
    }

    const fetchProfile = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Profile fetch timeout')), 5000); // 5 second timeout
        });
        
        const profilePromise = studentAuthService.getCurrentStudent();
        const data = await Promise.race([profilePromise, timeoutPromise]) as any;
        
        // /me endpoint returns clean data directly
        setProfile(data);
      } catch (e: any) {
        console.log("Failed to fetch student profile:", e?.response?.status || e.message);
        
        // Fallback: Try to get user info from token if API fails
        try {
          const token = localStorage.getItem('accessToken') || 
                        document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
          
          if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const decoded = JSON.parse(jsonPayload);
            
            // Create a minimal profile from token data
            const tokenProfile = {
              data: {
                name: decoded.email?.split('@')[0] || 'User',
                username: decoded.email?.split('@')[0] || 'user',
                email: decoded.email,
                profileImageUrl: null
              }
            };
            
            setProfile(tokenProfile);
            return;
          }
        } catch (tokenError) {
          console.log("Token parsing failed:", tokenError);
        }
        
        // If both API and token fail, set profile to null
        setProfile(null);
      }
    };
    
    fetchProfile();
    
    // Listen for custom event to refetch when onboarding completes
    window.addEventListener('profileUpdated', fetchProfile);
    return () => window.removeEventListener('profileUpdated', fetchProfile);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Topics', path: '/topics', icon: BookOpen },
    { name: 'Practice', path: '/practice', icon: PenTool },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  const handleLogout = async () => {
    try {
      await studentAuthService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('accessToken');
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/login');
    }
  };

  const isProfileLoaded = !!profile;
  const username = profile?.data?.username;
  const leetcode = profile?.data?.leetcode;
  const gfg = profile?.data?.gfg;
  
  const isUserOnboarded = isProfileLoaded ? Boolean(username && leetcode && gfg) : true;


  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border h-[64px] flex items-center px-6 lg:px-10 gap-5 shadow-sm transition-all">
      
      {/* Logo */}
      <Link href="/" className="font-serif italic text-2xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent shrink-0">
        BruteForce
      </Link>

      {/* Nav */}
      <nav className="hidden md:flex gap-1 flex-1 ml-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
          const Icon = link.icon;
          const isLocked = isProfileLoaded && !isUserOnboarded;
          
          
          return (
            <Link 
              key={link.name} 
              href={isLocked ? '#' : link.path}
              onClick={e => { 
                if (isLocked) {
                  e.preventDefault();
                  router.push('/login');
                }
              }}
              className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-[13.5px] font-semibold transition-all overflow-hidden ${
                isLocked ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isActive && !isLocked
                  ? 'text-primary bg-primary/10 border border-primary/20' 
                  : !isLocked ? 'text-muted-foreground hover:text-primary hover:bg-secondary border border-transparent' : 'text-muted-foreground border border-transparent'
              }`}
            >
              <Icon className="w-[15px] h-[15px]" />
              <span className="relative z-10">{link.name}</span>
              {isLocked && <div className="ml-1 text-[12px]"> <Lock/></div>}
            </Link>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        
        <ThemeToggle />

        {/* Check authentication and show appropriate UI */}
        {(() => {
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          const isAuthenticated = !!token;
          
          // If not authenticated, show login button
          if (!isAuthenticated) {
            return (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-primary hover:underline">
                  Login
                </Link>
              </div>
            );
          }
          
          // If authenticated and profile is loaded, show user dropdown
          if (isAuthenticated && isProfileLoaded && profile?.data) {
            return isUserOnboarded ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative w-9 h-9 rounded-full border-2 border-border hover:border-primary focus:outline-none transition-all flex items-center justify-center overflow-hidden shrink-0 cursor-pointer">
                    {profile.data.profileImageUrl ? (
                      <img src={profile.data.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-amber-600 text-primary-foreground flex items-center justify-center text-[12px] font-bold">
                        {profile.data.name ? profile.data.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border/80 shadow-xl dark:shadow-black/50">
                  <div className="px-3 py-2.5 mb-1 bg-secondary/30 rounded-lg border border-border/50">
                    <p className="text-[13.5px] font-semibold text-foreground truncate">{profile.data.name}</p>
                    <p className="text-[12px] text-muted-foreground font-mono truncate">@{profile.data.username}</p>
                  </div>
                  
                  <DropdownMenuSeparator className="bg-border/60 my-1" />
                  
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-[13px] font-medium focus:bg-primary/10 focus:text-primary py-2">
                    <Link href={profile.data.username ? `/profile/${profile.data.username}` : '/profile'} className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-border/60 my-1" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer rounded-lg text-[13px] font-medium text-destructive focus:bg-destructive/10 focus:text-destructive py-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button 
                onClick={handleLogout}
                className="px-3 py-1.5 bg-destructive/10 text-destructive border border-destructive/20 text-[13px] font-semibold rounded-lg hover:bg-destructive/20 transition-colors flex items-center gap-2 shrink-0"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out
              </button>
            );
          }
          
          // For authenticated users where profile is still loading, show a proper loading state
          if (isAuthenticated && (!isProfileLoaded || !profile?.data)) {
            return (
              <div className="w-9 h-9 rounded-full border-2 border-border bg-muted animate-pulse flex items-center justify-center shrink-0">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            );
          }
          
          // Default fallback
          return null;
        })()}
      </div>
    </header>
  );
}
