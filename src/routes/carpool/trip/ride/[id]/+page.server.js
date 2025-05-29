import Event from '$lib/server/event.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  try {
    const tripRide = await Event.getTripRideById(params.id);
    
    if (!tripRide || Object.keys(tripRide).length === 0) {
      throw error(404, 'Trip ride not found');
    }
    
    return {
      tripRide,
      id: params.id
    };
  } catch (e) {
    console.error('Error loading trip ride data:', e);
    if (e instanceof Error && e.message && e.message.includes('404')) {
      throw error(404, 'Trip ride not found');
    }
    throw error(500, 'Failed to load trip ride data');
  }
}