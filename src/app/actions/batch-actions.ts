'use server';
import { revalidatePath } from 'next/cache';
import { authenticatedFetch, isNextRedirect } from '@/lib/auth';

export async function createBatchAction(data: { batch_name: string, year: number, city_id: number }) {
    try {
        const res = await authenticatedFetch('http://localhost:5000/api/superadmin/batches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (res.ok) {
            revalidatePath('/superadmin/batches');
            revalidatePath('/superadmin/cities');
            revalidatePath('/superadmin');
            return { success: true, ...json };
        }
        return { success: false, message: json.message || 'Failed to create batch.' };
    } catch (e) {
        if (isNextRedirect(e)) throw e;
        return { success: false, message: 'Server connection error.' };
    }
}

export async function updateBatchAction(id: number, data: { batch_name?: string, year?: number, city_id?: number }) {
    try {
        const res = await authenticatedFetch(`http://localhost:5000/api/superadmin/batches/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (res.ok) {
            revalidatePath('/superadmin/batches');
            return { success: true, ...json };
        }
        return { success: false, message: json.message || 'Failed to update batch.' };
    } catch (e) {
        if (isNextRedirect(e)) throw e;
        return { success: false, message: 'Server connection error.' };
    }
}

export async function deleteBatchAction(id: number) {
    try {
        const res = await authenticatedFetch(`http://localhost:5000/api/superadmin/batches/${id}`, {
            method: 'DELETE'
        });
        const json = await res.json();
        if (res.ok) {
            revalidatePath('/superadmin/batches');
            revalidatePath('/superadmin/cities');
            revalidatePath('/superadmin');
            return { success: true, ...json };
        }
        return { success: false, message: json.message || 'Failed to delete batch.' };
    } catch (e) {
        if (isNextRedirect(e)) throw e;
        return { success: false, message: 'Server connection error.' };
    }
}
