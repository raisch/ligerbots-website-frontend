/** @module routes/carpool */

import Event from '$lib/server/event.js'
import User from '$lib/server/user'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  const jwt = cookies.get('jwt')
  const user = User.validate(jwt || '');

  // const user = cookies.get('user')
  if (!user) redirect(303, `/login?redirect=/carpool/vehicles`)
  const userId = user.id || null
  if (!userId) redirect(303, `/login?redirect=/carpool/vehicles`)
  const userEmail = user.email_address || null
  if (!userEmail) redirect(303, `/login?redirect=/carpool/vehicles`)
  const isAdmin = (await User.findByEmail(userEmail))?.is_admin ?? false;


  let events
  try {
    events = await Event.getEvents()
  } catch (error) {
    console.error(error)
  }

  // console.log('events:', events)

  return { events, userId, isAdmin }
}
