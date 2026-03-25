"use client";
import React, { Suspense, useState } from 'react';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { useResetPassword } from '../hooks/useResetPassword';
import { PasswordStrength } from './PasswordStrength';
import { BackButton } from './BackButton';
import { Eye, EyeOff } from "lucide-react";
function ResetPasswordFormContent() {
  const { fpNewPassword, setFpNewPassword, fpConfirmPassword, setFpConfirmPassword, error, loading, handleResetPassword } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2">
          Reset Password
        </h1>
        <p className="text-[13px] text-muted-foreground font-medium">
          Create a new strong password.
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-foreground tracking-wide">New Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={fpNewPassword}
            onChange={e => setFpNewPassword(e.target.value)}
            disabled={loading}
            className="h-11 bg-muted/40"
            required
          />
          {/* <PasswordStrength password={fpNewPassword} /> */}
        </div>
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-foreground tracking-wide">
            Confirm Password
          </label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={fpConfirmPassword}
              onChange={(e) => setFpConfirmPassword(e.target.value)}
              disabled={loading}
              className="h-11 bg-muted/40 pr-10"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition active:scale-90"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <BackButton disabled={loading} />
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 h-11 text-[14px] font-semibold tracking-wide bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground shadow-md transition-all active:scale-[0.98]"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </div>
      </form>
    </>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
