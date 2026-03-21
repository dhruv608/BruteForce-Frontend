import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function isNextRedirect(error: any) {
    return error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT');
}

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    let token = cookieStore.get('superadmin_token')?.value;

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        const responseClone = response.clone();
        try {
            const data = await responseClone.json();
            if (data.error === 'TOKEN_EXPIRED') {
                const refreshToken = cookieStore.get('superadmin_refresh')?.value;
                if (!refreshToken) {
                    redirect('/superadmin/login');
                }

                // Attempt refresh directly to backend
                const refreshRes = await fetch('http://localhost:5000/api/auth/refresh-token', {
                    method: 'POST',
                    headers: { 'Cookie': `refreshToken=${refreshToken}` }
                });

                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    if (refreshData.accessToken) {
                        token = refreshData.accessToken;
                        
                        // Update Next.js secure cookie store
                        cookieStore.set('superadmin_token', token as string, {
                            httpOnly: true, 
                            secure: process.env.NODE_ENV === 'production', 
                            path: '/', 
                            maxAge: 60 * 60 * 24 * 7
                        });

                        // Retry original backend request
                        headers.set('Authorization', `Bearer ${token}`);
                        response = await fetch(url, { ...options, headers });
                    } else {
                        redirect('/superadmin/login');
                    }
                } else {
                    redirect('/superadmin/login');
                }
            } else if (data.error === 'TOKEN_INVALID') {
                redirect('/superadmin/login');
            }
        } catch (e: any) {
            // Rethrow Next.js internal redirects
            if (isNextRedirect(e)) {
                throw e;
            }
            redirect('/superadmin/login');
        }
    }

    return response;
}
