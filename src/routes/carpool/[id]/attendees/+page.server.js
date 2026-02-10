import Event from '$lib/server/event'

export async function load({ params }) {
  const id = params.id
  let event
  try {
    event = await Event.getEventById(id)
  } catch (error) {
    console.error(error)
  }

  return { event }
}