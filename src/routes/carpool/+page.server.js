/** @module routes/carpool */

import Event from '$lib/server/event.js'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  let events
  try {
    events = await Event.getEvents()
  } catch (error) {
    console.error(error)
  }

  // console.log('events:', events)

  return { events }
}
