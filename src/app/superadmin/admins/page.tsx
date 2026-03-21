import { cookies } from 'next/headers';
import AdminsClient from './AdminsClient';
import { authenticatedFetch, isNextRedirect } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminsPage() {

  const fetchWithToken = async (path: string) => {
    try {
      const res = await authenticatedFetch(`http://localhost:5000${path}`, {
        cache: 'no-store'
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      if (isNextRedirect(e)) throw e;
      console.error(`Failed to fetch ${path}`, e);
      return null;
    }
  };

  const [adminsRes, citiesRes, batchesRes] = await Promise.all([
    fetchWithToken('/api/superadmin/admins'),
    fetchWithToken('/api/superadmin/cities'),
    fetchWithToken('/api/superadmin/batches')
  ]);

  const admins = adminsRes?.data || [];
  const cities = citiesRes || [];
  const batches = batchesRes || [];

  return <AdminsClient initialAdmins={admins} cities={cities} batches={batches} />;
}
