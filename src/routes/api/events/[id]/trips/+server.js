import { json } from '@sveltejs/kit'
import Event from '$lib/server/event.js'
import User from '$lib/server/user'

/**
 * Error message helper.
 *
 * @param {any} err
 * @returns {Response} JSON response with error message and optional status code.
 */
const errResp = (err, status = 500) =>
  json({ message: err instanceof Error || typeof err === 'object' ? err.message : 'Unknown error' }, { status })

// Create a new trip for an event
export async function POST({ params, request, cookies }) {
  const jwt = cookies.get('jwt')
  if (!jwt || !User.validate(jwt)) return new Response('Unauthorized', { status: 401 })

  const { id: eventId } = params
  
  try {
    const tripData = await request.json()
    const { tripType, ...data } = tripData
    
    let newTrip
    if (tripType === 'destination_trip') {
      newTrip = await Event.createDestinationTrip(eventId, data)
    } else if (tripType === 'return_trip') {
      newTrip = await Event.createReturnTrip(eventId, data)
    } else {
      return errResp({ message: 'Invalid trip type. Must be "destination_trip" or "return_trip"' }, 400)
    }
    
    return json(newTrip)
  } catch (error) {
    console.error('Error creating trip', error)
    return errResp(error)
  }
}
