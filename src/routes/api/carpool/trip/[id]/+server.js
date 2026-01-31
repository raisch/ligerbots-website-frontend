import { json } from '@sveltejs/kit'
import { getBackendClient } from '$lib/server/client'
import Queries from '$lib/server/graphql/event'

export async function DELETE({ params, url, request }) {
  const { id } = params || {}
  if (!id) return json({ error: 'id required' }, { status: 400 })
  const collection = url.searchParams.get('collection')
  if (!collection) return json({ error: 'collection required' }, { status: 400 })

  const client = await getBackendClient()

  try {

    const resp = await client.query(Queries.DELETE_TRIP_MUTATION, { collection, id })

    if (resp?.errors) {
      console.error('GraphQL errors deleting item:', resp.errors)
      return json({ error: 'GraphQL errors', details: resp.errors }, { status: 500 })
    }

    return json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}