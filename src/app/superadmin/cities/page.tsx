import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authenticatedFetch, isNextRedirect } from '@/lib/auth';
import CitiesClient from './CitiesClient';

async function fetchCities() {
  try {
    const res = await authenticatedFetch('http://localhost:5000/api/superadmin/cities', {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    console.error('Failed to fetch cities:', error);
    return [];
  }
}

export default async function CitiesPage() {
  const cities = await fetchCities();

  return <CitiesClient initialCities={cities} />;
}
