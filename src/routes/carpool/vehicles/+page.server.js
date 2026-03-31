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
  const userEmail = JSON.parse(decodeURIComponent(user ?? '')).email_address || null
  if (!userEmail) redirect(303, `/login?redirect=/carpool/vehicles`)

  let cars = await Ride.getAllRides()
  const isAdmin = (await User.findByEmail(userEmail))?.is_admin ?? false;
  const eligibleDrivers = await User.listEligibleCarpoolDrivers();
  if (!isAdmin) cars = cars.filter(ride => ride.driver?.some(driver => driver.id === userId))
  const userCanHaveCar = (await User.findByEmail(userEmail))?.carpool_driver_eligible ?? false;

  //if (!isAdmin) redirect(303, `/carpool`)

  console.log('cars:', cars, await User.findByEmail(userEmail))
  return { cars, userId, isAdmin, eligibleDrivers, userCanHaveCar }
}
