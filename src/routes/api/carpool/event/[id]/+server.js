import { json } from '@sveltejs/kit'
import { getBackendClient } from '$lib/server/client'
import Queries from '$lib/server/graphql/event'
import User from '$lib/server/user'

export async function DELETE({ params, url, request, cookies }) {
  const jwt = cookies.get('jwt')
  if (!jwt || !User.validate(jwt)) return new Response('Unauthorized', { status: 401 })

  const { id } = params || {}
  if (!id) return json({ error: 'id required' }, { status: 400 })

  const client = await getBackendClient()

  try {

    const resp = await client.query(Queries.DELETE_EVENT_MUTATION, { id })

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