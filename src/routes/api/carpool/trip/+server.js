import { json } from '@sveltejs/kit'
import { getBackendClient } from '$lib/server/client'
import Queries from '$lib/server/graphql/event'

export async function POST({ request }) {
  const body = await request.json()
  const { mode, collection, item, eventId } = body || {}

  if (!collection) return json({ error: 'collection required' }, { status: 400 })

  const client = await getBackendClient()

  try {
    if (collection === 'destination_trip') {
      if (mode === 'create') {
        const variables = { trip: { ...item, event: { id: String(eventId) } } }
        const resp = await client.query(Queries.CREATE_DESTINATION_TRIP_MUTATION, variables)
        return json(resp)
      } else if (mode === 'edit') {
        const variables = { id: String(item.id), trip: { ...item } }
        const resp = await client.query(Queries.UPDATE_DESTINATION_TRIP_MUTATION, variables)
        return json(resp)
      }
    }

    if (collection === 'return_trip') {
      if (mode === 'create') {
        const variables = { trip: { ...item, event: { id: String(eventId) } } }
        const resp = await client.query(Queries.CREATE_RETURN_TRIP_MUTATION, variables)
        return json(resp)
      } else if (mode === 'edit') {
        const variables = { id: String(item.id), trip: { ...item } }
        const resp = await client.query(Queries.UPDATE_RETURN_TRIP_MUTATION, variables)
        return json(resp)
      }
    }

    return json({ error: 'unsupported collection or mode' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return json({ error: String(err) }, { status: 500 })
  }
}
