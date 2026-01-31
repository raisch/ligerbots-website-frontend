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
      const eventData = {
        status: 'published'
      }
      
      if (item.name && item.name.trim()) eventData.name = item.name.trim()
      if (item.description && item.description.trim()) eventData.description = item.description.trim()
      if (item.start_date) eventData.start_date = item.start_date
      if (item.end_date) eventData.end_date = item.end_date
      if (item.location) eventData.location = item.location
      if (item.status) eventData.status = item.status
      
      const variables = { event: eventData }
      const resp = await client.query(Queries.CREATE_EVENT_MUTATION, variables)
      
      if (resp?.errors) {
        console.error('GraphQL errors creating event:', resp.errors)
        return json({ error: 'GraphQL errors', details: resp.errors }, { status: 500 })
      }
      
      return json(resp)
      
    } else if (mode === 'editEvent') {
      /** @type {Record<string, any>} */
      const eventData = {}
      
      if (item.name !== undefined) eventData.name = item.name
      if (item.description !== undefined) eventData.description = item.description
      if (item.start_date !== undefined) eventData.start_date = item.start_date
      if (item.end_date !== undefined) eventData.end_date = item.end_date
      if (item.location !== undefined) eventData.location = item.location
      if (item.status !== undefined) eventData.status = item.status
      
      const variables = { id: String(item.id), event: eventData }
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