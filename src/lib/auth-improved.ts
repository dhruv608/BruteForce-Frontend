import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Constants
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const REFRESH_ENDPOINT = `${BACKEND_URL}/api/auth/refresh-token`;
const TOKEN_COOKIE_NAME = 'superadmin_token';
const REFRESH_COOKIE_NAME = 'superadmin_refresh';
const TOKEN_EXPIRY_DAYS = 7;
const REDIRECT_PATH = '/superadmin/login';

// Types
interface AuthResponse {
  accessToken?: string;
  error?: string;
}

interface FetchError extends Error {
  digest?: string;
}

export function isNextRedirect(error: any): error is FetchError {
    return error && 
           typeof error === 'object' && 
           'digest' in error && 
           typeof error.digest === 'string' && 
           error.digest.startsWith('NEXT_REDIRECT');
}

function redirectToLogin(): never {
    redirect(REDIRECT_PATH);
}

async function handleTokenRefresh(refreshToken: string): Promise<string | null> {
    try {
        const refreshRes = await fetch(REFRESH_ENDPOINT, {
            method: 'POST',
            headers: { 'Cookie': `refreshToken=${refreshToken}` }
        });

        if (!refreshRes.ok) {
            return null;
        }

        const refreshData: AuthResponse = await refreshRes.json();
        return refreshData.accessToken || null;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
    }
}

async function updateTokenCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * TOKEN_EXPIRY_DAYS
    });
}

async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_COOKIE_NAME)?.value || null;
}

async function getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_COOKIE_NAME)?.value || null;
}

export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    let token = await getAuthToken();
    
    if (!token) {
        return redirectToLogin();
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        const responseClone = response.clone();
        
        try {
            const data: AuthResponse = await responseClone.json();
            
            if (data.error === 'TOKEN_EXPIRED') {
                const refreshToken = await getRefreshToken();
                
                if (!refreshToken) {
                    return redirectToLogin();
                }

                const newToken = await handleTokenRefresh(refreshToken);
                
                if (newToken) {
                    await updateTokenCookie(newToken);
                    
                    // Retry original request with new token
                    headers.set('Authorization', `Bearer ${newToken}`);
                    return await fetch(url, { ...options, headers });
                } else {
                    return redirectToLogin();
                }
            } else if (data.error === 'TOKEN_INVALID') {
                return redirectToLogin();
            }
        } catch (error: any) {
            // Rethrow Next.js internal redirects
            if (isNextRedirect(error)) {
                throw error;
            }
            return redirectToLogin();
        }
    }

    return response;
}

// Utility functions for other auth operations
export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE_NAME);
    cookieStore.delete(REFRESH_COOKIE_NAME);
    redirectToLogin();
}

export async function getCurrentUser(): Promise<string | null> {
    return await getAuthToken();
}
