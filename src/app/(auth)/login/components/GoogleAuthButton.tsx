"use client";
import React, { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { Button } from '../../shared/components/Button';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';

export function GoogleAuthButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setOnboardingUser] = useLocalStorage('onboardingUser', null);

  const processPostLogin = (u: any) => {
    if ( !u.leetcode_id || !u.gfg_id || !u.username) {
      setOnboardingUser(u);
      router.push('/');
    } else {
      router.push('/');
    }
  };

  const handleGoogleCallback = async (idToken: string) => {
    setLoading(true);
    setError('');
    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      if (!payload.email?.endsWith('@pwioi.com')) {
        setError('Access denied: Please sign in with your @pwioi.com email address.');
        setLoading(false);
        return;
      }

      const data = await studentAuthService.googleLogin(idToken);
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        document.cookie = `accessToken=${data.accessToken}; path=/`;
        processPostLogin(data.user);
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('');
    // Ensure the Google SDK is loaded
    if (typeof window !== 'undefined' && (window as any).google) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      if (!clientId) {
        setError('Google Client ID is missing. Check your environment variables.');
        return;
      }

      // Initialize GSI One-Tap / Popup explicitly for this click
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: (res: any) => {
          if (res.credential) handleGoogleCallback(res.credential);
        },
      });

      // Trigger the official GSI prompt
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setError('Google Sign-In popup was blocked by your browser. Please allow popups or use One-Tap.');
        }
      });
    } else {
      setError('Google Auth script is still loading. Please try again in a moment.');
    }
  };

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      {error && (
        <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium rounded-xl text-center">
          {error}
        </div>
      )}
      <Button
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-11 mb-6 text-[13.5px] font-medium transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/40"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 18 18">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
        Continue with Google
      </Button>
    </>
  );
}
