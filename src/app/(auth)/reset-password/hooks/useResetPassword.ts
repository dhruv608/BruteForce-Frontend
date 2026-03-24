import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { useToast } from '../../shared/hooks/useToast';

export function useResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const otpParam = searchParams.get('otp');
  const { showToast } = useToast();

  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailParam || !otpParam) {
      router.push('/forgot-password');
    }
  }, [emailParam, otpParam, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpNewPassword) {
      showToast("Please enter a new password.", 'error');
      setError("Please enter a new password.");
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      showToast("Passwords do not match.", 'error');
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await studentAuthService.resetPassword({
        email: emailParam || '',
        otp: otpParam || '',
        newPassword: fpNewPassword
      });
      showToast("Password reset successful ✅", "success");
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to reset password.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { fpNewPassword, setFpNewPassword, fpConfirmPassword, setFpConfirmPassword, error, loading, handleResetPassword, router };
}
