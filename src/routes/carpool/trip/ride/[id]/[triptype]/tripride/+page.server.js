import Trip from '$lib/server/trip.js';
import TripRide from '$lib/server/tripride.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  try {
    // Get the trip details
    const trip = await Trip.getTrips(params.id, params.triptype);
    
    if (!trip || trip.length === 0) {
      throw error(404, 'Trip not found');
    }

    // Get trip rides for this trip
    const tripRides = await TripRide.getTripRidesByTrip(params.id, params.triptype);
    
    return {
      trip: trip[0] || trip, // Get the first item if it's an array
      tripRides: tripRides,
      tripType: params.triptype,
      id: params.id
    };
  } catch (e) {
    console.error('Error loading trip and ride data:', e);
    throw error(500, 'Failed to load trip ride data');
  }
}
