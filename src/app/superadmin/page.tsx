import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';
import { authenticatedFetch, isNextRedirect } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SuperAdminPage() {

  // Fetch Stats
  let stats = { totalCities: 0, totalBatches: 0, totalAdmins: 0 };
  try {
    const statsRes = await authenticatedFetch('http://localhost:5000/api/superadmin/stats', {
      cache: 'no-store'
    });

    if (statsRes.ok) {
      const data = await statsRes.json();
      stats = data.data;
    }
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    console.error("Failed to fetch superadmin stats", error);
  }

  // Fetch Cities
  let cities = [];
  try {
    const citiesRes = await authenticatedFetch('http://localhost:5000/api/superadmin/cities', {
      cache: 'no-store'
    });

    if (citiesRes.ok) {
      const data = await citiesRes.json();
      cities = data;
    }
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    console.error("Failed to fetch cities", error);
  }

  return <DashboardClient stats={stats} cities={cities} />;
}
