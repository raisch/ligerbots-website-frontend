import { getBackendClient } from '$lib/server/client.js'
import Event from '$lib/server/event'
import queries from '$lib/server/graphql/event.js'
import User from '$lib/server/user'
import { redirect } from '@sveltejs/kit'

export async function load({ params, cookies }) {
  const id = params.id
  
  const jwt = cookies.get('jwt')
  if (!jwt || !User.validate(jwt)) redirect(303, `/login?redirect=/carpool/${id}/riderlist`)
  
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