/** @module routes/carpool/[id] */

import Event from '$lib/server/event.js'
import Ride from '$lib/server/ride'
import Rider from '$lib/server/rider'
import User from '$lib/server/user'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {

  const user = cookies.get('user')
  if (!user) redirect(303, `/login?redirect=/carpool/vehicles`)
  const userId = JSON.parse(decodeURIComponent(user ?? '')).id || null
  if (!userId) redirect(303, `/login?redirect=/carpool/vehicles`)
  
  

  const cars = await Ride.getAllRides()
  const isAdmin = (await User.findById(userId))?.is_admin ?? false;
  const eligibleDrivers = await User.listEligibleCarpoolDrivers();

  if (!isAdmin) redirect(303, `/carpool`)

  // console.log('event:', event)

  return { cars, userId, isAdmin, eligibleDrivers }
}
