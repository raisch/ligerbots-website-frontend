import Trip from '$lib/server/trip.js'
import Ride from '$lib/server/ride.js'
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  try {
    const event = await Trip.getTrips(params.id, params.triptype);
    const availableRides = await Ride.getAllRides();
    
    return {
      event: event,
      availableRides: availableRides,
    };
  } catch (err) {
    console.error('Error loading trip data:', err);
    throw error(500, 'Failed to load trip data');
  }
}
