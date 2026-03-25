import api from '../lib/api';
import { isAdminToken, clearAuthTokens } from '../lib/auth-utils';

export const getCurrentSuperAdmin = async () => {
  // Check if we have an admin token before making the request
  if (!isAdminToken()) {
    clearAuthTokens(); // Clear invalid tokens
    const error = new Error('Access denied. Admins only.');
    (error as any).response = { status: 403, data: { error: 'Access denied. Admins only.' } };
    throw error;
  }

  const response = await api.get('/api/superadmin/me');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/api/superadmin/stats');
  return response.data.data;
};
