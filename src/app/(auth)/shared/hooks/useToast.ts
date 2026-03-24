import { useState, useEffect } from 'react';

export type ToastMsg = { id: number; message: string; type: 'success' | 'error' };

let listeners: React.Dispatch<React.SetStateAction<ToastMsg[]>>[] = [];
let toasts: ToastMsg[] = [];

export const toastEvent = (message: string, type: 'success' | 'error' = 'success') => {
  const id = Date.now();
  const newToast = { id, message, type };
  toasts = [...toasts, newToast];
  listeners.forEach(l => l(toasts));
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    listeners.forEach(l => l(toasts));
  }, 3000);
};

export function useToast() {
  const [state, setState] = useState<ToastMsg[]>(toasts);
  useEffect(() => {
    listeners.push(setState);
    return () => { listeners = listeners.filter(l => l !== setState); };
  }, []);
  
  return { toasts: state, showToast: toastEvent };
}
