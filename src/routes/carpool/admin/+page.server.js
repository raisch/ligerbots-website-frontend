import Ride from '$lib/server/ride.js'
import User from '$lib/server/user.js'
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    const cars = await Ride.getAllRides();
    const users = await User.listForDirectory();
    
    return {
      cars: cars,
      users: users,
    };
  } catch (err) {
    console.error('Error loading admin data:', err);
    throw error(500, 'Failed to load admin data');
  }
}