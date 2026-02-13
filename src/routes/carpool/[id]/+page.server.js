/** @module routes/carpool/[id] */

import Event from '$lib/server/event.js'
import Ride from '$lib/server/ride'
import Rider from '$lib/server/rider'
import User from '$lib/server/user'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {
  const id = params.id
  let event
  try {
    event = await Event.getEventById(id)
  } catch (error) {
    console.error(error)
  }

  const user = cookies.get('user')
  if (!user) redirect(303, `/login?redirect=/carpool/${id}`)
  const userId = JSON.parse(decodeURIComponent(user ?? '')).id || null
  if (!userId) redirect(303, `/login?redirect=/carpool/${id}`)
  
  const existingRides = await Rider.getRidesForRider(event?.id ?? '-1', userId)

  const allCars = await Ride.getAllRides()
  const userOwnedCars = allCars.filter(ride => ride.driver?.some(driver => driver.id === userId))
  const userCanHaveCar = (await User.findById(userId))?.carpool_driver_eligible ?? false;

  // console.log('event:', event)

  return { event, userId, existingRides, cars: { allCars, userOwnedCars, userCanHaveCar } }
}
