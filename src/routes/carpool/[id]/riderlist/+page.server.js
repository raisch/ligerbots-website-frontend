import { getBackendClient } from '$lib/server/client.js'
import Event from '$lib/server/event'
import queries from '$lib/server/graphql/event.js'

export async function load({ params }) {
  const id = params.id
  let event
  try {
    event = await Event.getEventById(id)
  } catch (error) {
    console.error(error)
  }

  console.log(event)

  if (!event) return { event: null, optout: null}
  let optout = Event.getOptOutEventAttendees(/** @type {import('$lib/server/event').EventType} */(event));



  return { event, optout }
}