'use server';
import { revalidatePath } from 'next/cache';
import { authenticatedFetch, isNextRedirect } from '@/lib/auth';

export async function createCityAction(data: { city_name: string }) {
    try {
        const res = await authenticatedFetch('http://localhost:5000/api/superadmin/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (res.ok) {
            revalidatePath('/superadmin/cities');
            revalidatePath('/superadmin/admins'); // update dropdowns globally
            revalidatePath('/superadmin');
            return { success: true, ...json };
        }
        return { success: false, message: json.message || 'Failed to create city.' };
    } catch (e) {
        if (isNextRedirect(e)) throw e;
        return { success: false, message: 'Server connection error.' };
    }
}

export async function deleteCityAction(id: number) {
    try {
        const res = await authenticatedFetch(`http://localhost:5000/api/superadmin/cities/${id}`, {
            method: 'DELETE'
        });
        const json = await res.json();
        if (res.ok) {
            revalidatePath('/superadmin/cities');
            revalidatePath('/superadmin/admins');
            revalidatePath('/superadmin');
            return { success: true, ...json };
        }
        return { success: false, message: json.message || 'Failed to delete city.' };
    } catch (e) {
        if (isNextRedirect(e)) throw e;
        return { success: false, message: 'Server connection error.' };
    }
}
