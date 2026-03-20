import { json } from '@sveltejs/kit'
import { getBackendClient } from '$lib/server/client'
import Queries from '$lib/server/graphql/event'

export async function DELETE({ params, url, request }) {
  const { id } = params || {}
  if (!id) return json({ error: 'id required' }, { status: 400 })
  const collection = url.searchParams.get('collection')
  const relationshipId = url.searchParams.get('relationship')
  if (!collection) return json({ error: 'collection required' }, { status: 400 })
  if (!relationshipId) return json({ error: 'relationship required' }, { status: 400 })

    console.log(`Deleting ${collection} id ${id} (relationship ${relationshipId})`)

  const client = await getBackendClient()

  try {

    const resp1 = await client.query(collection === 'destination_trip' ? Queries.DELETE_DESTINATION_TRIP_MUTATION : Queries.DELETE_EVENT_MUTATION, { id })

    if (resp1?.errors) {
      console.error('GraphQL errors deleting item:', resp1.errors)
      return json({ error: 'GraphQL errors', details: resp1.errors }, { status: 500 })
    }

    const resp2 = await client.query(Queries.DELETE_EVENT_TRIP_MUTATION, { id: relationshipId })
    if (resp2?.errors) {
      console.error('GraphQL errors deleting relationship:', resp2.errors)
      return json({ error: 'GraphQL errors', details: resp2.errors }, { status: 500 })
    }

    return json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}