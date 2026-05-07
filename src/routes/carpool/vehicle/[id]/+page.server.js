import TripRide from '$lib/server/vehicle.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  try {
    const tripRide = await TripRide.getTripRideById(params.id);
    
    if (!tripRide || Object.keys(tripRide).length === 0) {
      throw error(404, 'Trip ride not found');
    }
    
    return {
      tripRide,
      id: params.id
    };
  } catch (e) {
    console.error('Error loading trip ride data:', e);
    throw error(500, 'Failed to load trip ride data');
  }
}