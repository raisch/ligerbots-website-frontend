import { json } from '@sveltejs/kit'
import Event from '$lib/server/event.js'

/**
 * Error message helper.
 *
 * @param {any} err
 * @returns {Response} JSON response with error message and optional status code.
 */
const errResp = (err, status = 500) =>
  json({ message: err instanceof Error ? err.message : 'Unknown error' }, { status })

// Get a single event by ID
export async function GET({ params }) {
  const { id } = params
  try {
    const eventData = await Event.getEventById(id)
    if (!eventData) {
      return json({ message: 'Event not found' }, { status: 404 })
    }
    return json(eventData)
  } catch (error) {
    console.error('Error getting event', error)
    return errResp(error)
  }
}

// Update an existing event
export async function POST({ params, request }) {
  const { id } = params
  const eventData = await request.json()
  try {
    const updatedEvent = await Event.updateEvent(id, eventData)
    return json(updatedEvent)
  } catch (error) {
    console.error('Error updating event', error)
    return errResp(error)
  }
}

// Archive an event
export async function PATCH({ params }) {
  const { id } = params
  try {
    const archivedEvent = await Event.archiveEvent(id)
    return json(archivedEvent)
  } catch (error) {
    console.error('Error archiving event', error)
    return errResp(error)
  }
}

// Delete an event
export async function DELETE({ params }) {
  const { id } = params
  try {
    const result = await Event.deleteEvent(id)
    return json(result)
  } catch (error) {
    console.error('Error deleting event', error)
    return errResp(error)
  }
}
