import Event from '$lib/server/event'
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

  return { event }
}