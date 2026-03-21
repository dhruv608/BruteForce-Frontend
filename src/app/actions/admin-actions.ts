'use server';
import { revalidatePath } from 'next/cache';
import { authenticatedFetch, isNextRedirect } from '@/lib/auth';

export async function createAdminAction(data: any) {
    try {
        const payload = { ...data };
        delete payload.city_id; // Explicitly do not send city_id

        if (!payload.batch_id) delete payload.batch_id;
        else payload.batch_id = parseInt(payload.batch_id);

        const res = await authenticatedFetch('http://localhost:5000/api/superadmin/admins', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (res.ok) {
            revalidatePath('/superadmin/admins');
        }
        return json;
    } catch (e) {
        if (isNextRedirect(e)) throw e;
        return { success: false, message: 'Server connection error.' };
    }
}

export async function updateAdminAction(id: number, data: any) {
    try {
        const payload = { ...data };
        delete payload.city_id; // Explicitly do not send city_id

        if (!payload.batch_id) delete payload.batch_id;
        else payload.batch_id = parseInt(payload.batch_id);

        if (!payload.password) delete payload.password;

        const res = await authenticatedFetch(`http://localhost:5000/api/superadmin/admins/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (res.ok) {
            revalidatePath('/superadmin/admins');
        }
        return json;
    } catch (e) {
        if (isNextRedirect(e)) throw e;
        return { success: false, message: 'Server connection error.' };
    }
}

export async function deleteAdminAction(id: number) {
    try {
        const res = await authenticatedFetch(`http://localhost:5000/api/superadmin/admins/${id}`, {
            method: 'DELETE'
        });
        const json = await res.json();
        if (res.ok) {
            revalidatePath('/superadmin/admins');
        }
        return json;
    } catch (e) {
        if (isNextRedirect(e)) throw e;
        return { success: false, message: 'Server connection error.' };
    }
}

export async function getBatchesByCityAction(cityName: string) {
    try {
        const res = await authenticatedFetch(`http://localhost:5000/api/superadmin/batches?city=${encodeURIComponent(cityName)}`, {
            cache: 'no-store'
        });
        const json = await res.json();
        return Array.isArray(json) ? json : (json?.data || []);
    } catch (e) {
        if (isNextRedirect(e)) throw e;
        return [];
    }
}
