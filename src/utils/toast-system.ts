"use client";

import React from 'react';
import { toast, ToasterProps } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Loader2,
  X
} from 'lucide-react';

// Premium SaaS toast configuration
export const toastConfig: ToasterProps = {
  position: 'top-right',
  theme: 'system',
  richColors: false,
  closeButton: false,
  duration: 2000,
  className: 'premium-saas-toast',
  toastOptions: {
    classNames: {
      toast: 'premium-saas-toast',
      icon: 'premium-toast-icon',
      title: 'premium-toast-title',
      description: 'premium-toast-description',
      actionButton: 'premium-toast-action',
      cancelButton: 'premium-toast-cancel',
      closeButton: 'premium-toast-close',
    },
  },
};

// Custom premium toast renderer
const PremiumToastRenderer = ({ toast: toastObj, title, description, icon, id }: any) => {
  const isSuccess = toastObj.type === 'success';
  const isError = toastObj.type === 'error';
  const isWarning = toastObj.type === 'warning';
  const isInfo = toastObj.type === 'info';
  const isLoading = toastObj.type === 'loading';

  const getIcon = () => {
    if (isLoading) return React.createElement(Loader2, { className: "w-5 h-5 animate-spin text-blue-400" });
    if (isSuccess) return React.createElement(CheckCircle, { className: "w-5 h-5 text-lime-400" });
    if (isError) return React.createElement(XCircle, { className: "w-5 h-5 text-red-400" });
    if (isWarning) return React.createElement(AlertCircle, { className: "w-5 h-5 text-yellow-400" });
    if (isInfo) return React.createElement(Info, { className: "w-5 h-5 text-blue-400" });
    return icon;
  };

  const getBorderColor = () => {
    if (isSuccess) return 'border-lime-500/30';
    if (isError) return 'border-red-500/30';
    if (isWarning) return 'border-yellow-500/30';
    if (isInfo) return 'border-blue-500/30';
    return 'border-gray-500/30';
  };

  const getProgressBarColor = () => {
    if (isSuccess) return 'bg-gradient-to-r from-lime-500 to-lime-400';
    if (isError) return 'bg-gradient-to-r from-red-500 to-red-400';
    if (isWarning) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    if (isInfo) return 'bg-gradient-to-r from-blue-500 to-blue-400';
    return 'bg-gradient-to-r from-gray-500 to-gray-400';
  };

  const getTitleColor = () => {
    if (isSuccess) return 'text-lime-400';
    if (isError) return 'text-red-400';
    if (isWarning) return 'text-yellow-400';
    if (isInfo) return 'text-blue-400';
    return 'text-gray-300';
  };

  const getIconGlow = () => {
    if (isSuccess) return 'shadow-lime-500/25';
    if (isError) return 'shadow-red-500/25';
    if (isWarning) return 'shadow-yellow-500/25';
    if (isInfo) return 'shadow-blue-500/25';
    return 'shadow-gray-500/25';
  };

  const duration = toastObj.duration || 4000;

  return React.createElement('div', { className: "premium-toast-wrapper" },
    React.createElement('div', { className: `premium-saas-toast ${getBorderColor()}` },
      // Icon Container
      React.createElement('div', { className: `premium-icon-container ${getIconGlow()}` },
        getIcon()
      ),
      
      // Content
      React.createElement('div', { className: "premium-toast-content" },
        React.createElement('div', { className: `premium-toast-title ${getTitleColor()}` },
          title || description
        )
      ),
      
      // Close Button
      !isLoading && React.createElement('button', {
        onClick: () => toast.dismiss(id),
        className: "premium-toast-close-btn"
      },
        React.createElement(X, { className: "w-4 h-4" })
      ),
      
      // Progress Bar
      !isLoading && duration && duration !== Infinity && 
        React.createElement('div', { className: "premium-progress-container" },
          React.createElement('div', {
            className: `premium-progress-bar ${getProgressBarColor()}`,
            style: {
              animation: `shrink ${duration}ms linear forwards`,
            }
          })
        )
    )
  );
};

// Premium SaaS toast variants
export const glassToast = {
  success: (message: string, options?: any) => {
    return toast.custom((id) => 
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'success', duration: 4000, ...options },
        title: message,
        id: id
      })
    , { duration: 4000, ...options });
  },

  error: (message: string, options?: any) => {
    return toast.custom((id) => 
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'error', duration: 6000, ...options },
        title: message,
        id: id
      })
    , { duration: 6000, ...options });
  },

  warning: (message: string, options?: any) => {
    return toast.custom((id) => 
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'warning', duration: 5000, ...options },
        title: message,
        id: id
      })
    , { duration: 5000, ...options });
  },

  info: (message: string, options?: any) => {
    return toast.custom((id) => 
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'info', duration: 4000, ...options },
        title: message,
        id: id
      })
    , { duration: 4000, ...options });
  },

  loading: (message: string, options?: any) => {
    return toast.custom((id) => 
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'loading', duration: Infinity, ...options },
        title: message,
        id: id
      })
    , { duration: Infinity, ...options });
  },

  // Promise-based toast for async operations
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  // Dismiss all toasts
  dismiss: () => {
    toast.dismiss();
  },

  // Dismiss specific toast
  dismissId: (id: string | number) => {
    toast.dismiss(id);
  },
};

// User-friendly error messages (no raw backend errors)
export const userFriendlyMessages = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  ACCESS_DENIED: 'You do not have permission to perform this action.',
  
  // User/Student errors
  USER_NOT_FOUND: 'User not found.',
  USER_EXISTS: 'An account with this email already exists.',
  STUDENT_NOT_FOUND: 'Student not found.',
  STUDENT_EXISTS: 'This student already exists.',
  USERNAME_TAKEN: 'This username is already taken.',
  
  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again.',
  INVALID_INPUT: 'Invalid information provided.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password does not meet requirements.',
  
  // Resource errors
  NOT_FOUND_ERROR: 'Resource not found.',
  TOPIC_NOT_FOUND: 'Topic not found.',
  CLASS_NOT_FOUND: 'Class not found.',
  QUESTION_NOT_FOUND: 'Question not found.',
  BATCH_NOT_FOUND: 'Batch not found.',
  
  // Database errors
  DATABASE_ERROR: 'Database operation failed. Please try again.',
  DUPLICATE_ENTRY: 'This record already exists.',
  
  // Network/Server errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Something went wrong. Please try again.',
  INTERNAL_ERROR: 'Internal server error. Please try again.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
  
  // File/Upload errors
  FILE_TOO_LARGE: 'File size exceeds the limit.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  UPLOAD_FAILED: 'File upload failed.',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait and try again.',
  
  // Authorization errors
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  
  // Generic fallback
  ERROR: 'Something went wrong. Please try again.',
};

// Helper function to get user-friendly message
export const getUserFriendlyMessage = (error: any): string => {
  // First check if we have a backend error code
  const errorCode = error?.response?.data?.code || error?.code;
  if (errorCode && userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]) {
    return userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages];
  }

  // Handle specific HTTP status codes
  const status = error?.response?.status;
  switch (status) {
    case 400:
      return userFriendlyMessages.VALIDATION_ERROR;
    case 401:
      return userFriendlyMessages.TOKEN_EXPIRED;
    case 403:
      return userFriendlyMessages.FORBIDDEN;
    case 404:
      return userFriendlyMessages.NOT_FOUND_ERROR;
    case 429:
      return userFriendlyMessages.RATE_LIMIT_EXCEEDED;
    case 500:
      return userFriendlyMessages.SERVER_ERROR;
    case 502:
    case 503:
    case 504:
      return userFriendlyMessages.SERVICE_UNAVAILABLE;
  }

  // Network errors
  if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
    return userFriendlyMessages.NETWORK_ERROR;
  }

  // Fallback
  return userFriendlyMessages.ERROR;
};

// Enhanced error handler with user-friendly messages
export const handleToastError = (error: any, context?: string) => {
  // Don't show toast for silent errors
  if (error?.silent || error?.isSilent) {
    return;
  }

  const userMessage = getUserFriendlyMessage(error);
  glassToast.error(userMessage);
};

// Success messages
export const successMessages = {
  LOGIN: 'Logged in successfully!',
  LOGOUT: 'Logged out successfully!',
  REGISTER: 'Account created successfully!',
  PASSWORD_RESET: 'Password reset successfully!',
  PASSWORD_UPDATED: 'Password updated successfully!',
  CREATE: 'Created successfully!',
  UPDATE: 'Updated successfully!',
  DELETE: 'Deleted successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
  FILE_DOWNLOADED: 'File downloaded successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  CUSTOM: 'Operation completed successfully!',
  EMAIL_SENT: 'Email sent successfully!',
};

// Success notification helper
export const showSuccess = (action: keyof typeof successMessages | string, customMessage?: string) => {
  const message = customMessage || successMessages[action as keyof typeof successMessages] || `${action} successful!`;
  glassToast.success(message);
};

// Delete notification helper
export const showDeleteSuccess = (entity: string, customMessage?: string) => {
  const message = customMessage || `${entity} deleted successfully!`;
  glassToast.error(message);
};

// Loading state helper
export const showLoading = (action: string) => {
  glassToast.loading(`${action}...`);
};

// Info notification helper
export const showInfo = (message: string) => {
  glassToast.info(message);
};

// Warning notification helper
export const showWarning = (message: string) => {
  glassToast.warning(message);
};

// Login flow with promise toast
export const showLoginPromise = (loginPromise: Promise<any>) => {
  return glassToast.promise(loginPromise, {
    loading: 'Logging in...',
    success: 'Login successful! ',
    error: 'Login failed',
  });
};

// Signup flow with promise toast
export const showSignupPromise = (signupPromise: Promise<any>) => {
  return glassToast.promise(signupPromise, {
    loading: 'Creating account...',
    success: 'Account created successfully!',
    error: 'Failed to create account',
  });
};

// Form submission with promise toast
export const showFormPromise = <T>(
  formPromise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return glassToast.promise(formPromise, messages);
};

export default {
  glassToast,
  handleToastError,
  showSuccess,
  showDeleteSuccess,
  showLoading,
  showInfo,
  showWarning,
  showLoginPromise,
  showSignupPromise,
  showFormPromise,
  toastConfig,
  userFriendlyMessages,
  successMessages,
  getUserFriendlyMessage,
};
