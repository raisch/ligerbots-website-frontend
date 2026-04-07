/** @module routes/carpool */

import Event from '$lib/server/event.js'
import User from '$lib/server/user'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  const jwt = cookies.get('jwt')
  console.log(cookies.getAll())
  if (!jwt || !User.validate(jwt)) redirect(303, '/login?redirect=/carpool')

  let events
  try {
    events = await Event.getEvents()
  } catch (error) {
    console.error(error)
  }

  // console.log('events:', events)

  return { events }
}
