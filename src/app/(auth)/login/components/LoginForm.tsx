"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { studentAuthService } from '@/services/student/auth.service';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';

export function LoginForm() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setOnboardingUser] = useLocalStorage('onboardingUser', null);

  const processPostLogin = (u: any) => {
    if (!u.id || !u.leetcode_id || !u.gfg_id || !u.username) {
      setOnboardingUser(u);
      router.push('/');
    } else {
      router.push('/');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      const isEmail = emailOrUsername.includes('@');
      const payload = isEmail
        ? { email: emailOrUsername, password }
        : { username: emailOrUsername, password };

      const data = await studentAuthService.login(payload);

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        document.cookie = `accessToken=${data.accessToken}; path=/`;
        processPostLogin(data.user);
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium rounded-xl text-center">
          {error}
        </div>
      )}
      <div className="space-y-1.5">
        <label className="text-[12px] font-semibold text-foreground tracking-wide">
          Email or Username
        </label>
        <Input
          type="text"
          placeholder="student@example.com or username"
          value={emailOrUsername}
          onChange={e => setEmailOrUsername(e.target.value)}
          disabled={loading}
          className="h-11 bg-muted/40"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-foreground tracking-wide">
            Password
          </label>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); router.push('/forgot-password'); }}
            className="text-primary font-medium text-[12px] hover:underline transition-all focus:outline-none"
          >
            Forgot password?
          </button>
        </div>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          className="h-11 bg-muted/40"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 mt-4 text-[14px] font-semibold tracking-wide bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground shadow-md transition-all active:scale-[0.98]"
      >
        {loading ? 'Authenticating...' : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </>
        )}
      </Button>
    </form>
  );
}
