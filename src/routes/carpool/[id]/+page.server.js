/** @module routes/carpool/[id] */

import Event from '$lib/server/event.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const id = params.id
  let event
  try {
    event = await Event.getEventById(id)
  } catch (error) {
    console.error(error)
  }

  // console.log('event:', event)

  return { event }
}
