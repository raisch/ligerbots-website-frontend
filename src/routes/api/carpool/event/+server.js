import { json } from '@sveltejs/kit'
import { getBackendClient } from '$lib/server/client'
import Queries from '$lib/server/graphql/event'

export async function POST({ request }) {
  const body = await request.json()
  const { mode, item, eventId } = body || {}

  const client = await getBackendClient()

  try {
    if (mode === 'createEvent') {
      /** @type {Record<string, any>} */
      const tripData = {
        status: 'published'
      }
      
      if (item.name && item.name.trim()) tripData.name = item.name.trim()
      if (item.description && item.description.trim()) tripData.description = item.description.trim()
      if (item.start_date) tripData.start_date = item.start_date
      if (item.end_date) tripData.end_date = item.end_date
      if (item.location) tripData.location = item.location
      if (item.status) tripData.status = item.status
      
      const variables = { event: tripData }
      const resp = await client.query(Queries.CREATE_EVENT_MUTATION, variables)
      
      if (resp?.errors) {
        console.error('GraphQL errors creating event:', resp.errors)
        return json({ error: 'GraphQL errors', details: resp.errors }, { status: 500 })
      }
      
      return json(resp)
      
    } else if (mode === 'editEvent') {
      /** @type {Record<string, any>} */
      const tripData = {}
      
      if (item.name !== undefined) tripData.name = item.name
      if (item.description !== undefined) tripData.description = item.description
      if (item.start_date !== undefined) tripData.start_date = item.start_date
      if (item.end_date !== undefined) tripData.end_date = item.end_date
      if (item.location !== undefined) tripData.location = item.location
      if (item.status !== undefined) tripData.status = item.status
      
      const variables = { id: String(item.id), trip: tripData }
      const resp = await client.query(Queries.UPDATE_EVENT_MUTATION, variables)
      
      if (resp?.errors) {
        console.error('GraphQL errors updating event:', resp.errors)
        return json({ error: 'GraphQL errors', details: resp.errors }, { status: 500 })
      }
      return json(resp)
    }

    return json({ error: 'unsupported mode' }, { status: 400 })
  } catch (err) {
    console.error('Error in /api/carpool/event:', err)
    
    /** @type {any} */
    const anyErr = err
    
    if (Array.isArray(anyErr?.errors) && anyErr.errors.length > 0) {
      const nested = anyErr.errors[0]?.extensions?.errors
      if (nested) {
        return json({ error: 'GraphQL validation error', details: nested }, { status: 400 })
      }
      
      return json({ 
        error: 'GraphQL error', 
        message: anyErr.errors[0]?.message,
        details: anyErr.errors 
      }, { status: 400 })
    }

    let details = anyErr?.message || String(anyErr)
    if (anyErr?.response) {
      try {
        const body = await anyErr.response.json()
        details = body
      } catch (e) {
        try {
          const text = await anyErr.response.text()
          details = text
        } catch (e2) {
          // ignore
        }
      }
    }
    
    return json({ error: anyErr?.message || 'Internal Server Error', details }, { status: 500 })
  }
}