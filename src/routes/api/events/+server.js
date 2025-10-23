import { json } from '@sveltejs/kit'
import Event from '$lib/server/event.js'

/**
 * Error message helper.
 *
 * @param {any} err
 * @returns {Response} JSON response with error message and optional status code.
 */
const errResp = (err, status = 500) =>
  json({ message: err instanceof Error || typeof err === 'object' ? err.message : 'Unknown error' }, { status })

// Get all events
export async function GET({ url }) {
  const status = url.searchParams.get('status') || 'published'
  try {
    const events = await Event.getEvents(status)
    return json(events)
  } catch (error) {
    console.error('Error getting events', error)
    return errResp(error)
  }
}

// Create a new event
export async function POST({ request }) {
  try {
    const eventData = await request.json()
    const newEvent = await Event.createEvent(eventData)
    return json(newEvent)
  } catch (error) {
    console.error('Error creating event', error)
    return errResp(error)
  }
}
