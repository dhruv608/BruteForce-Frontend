"use client";

// Backward compatibility wrapper for existing toast usage
export * from './toast-system';

// Re-export toast functions with direct access for backward compatibility
import { glassToast } from './toast-system';

// Direct exports for backward compatibility
export const toast = {
  success: glassToast.success,
  error: glassToast.error,
  warning: glassToast.warning,
  info: glassToast.info,
  loading: glassToast.loading,
  promise: glassToast.promise,
  dismiss: glassToast.dismiss,
};
