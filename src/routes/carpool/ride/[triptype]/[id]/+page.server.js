import Trip from '$lib/server/trip.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  try {
    const trip = await Trip.getTrips(params.id, params.triptype);
    
    if (!trip || trip.length === 0) {
      throw error(404, 'Trip not found');
    }
    
    return {
      trip: trip[0] || trip, // Get the first item if it's an array
      tripType: params.triptype,
      id: params.id
    };
  } catch (e) {
    console.error('Error loading trip data:', e);
    throw error(500, 'Failed to load ride data');
  }
}
