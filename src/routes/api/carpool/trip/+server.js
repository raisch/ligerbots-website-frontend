import { json } from '@sveltejs/kit'
import { getBackendClient } from '$lib/server/client'
import Queries from '$lib/server/graphql/event'
import User from '$lib/server/user'

export async function POST({ request, cookies }) {
  const jwt = cookies.get('jwt')
  if (!jwt || !User.validate(jwt)) return new Response('Unauthorized', { status: 401 })

  const body = await request.json()
  const { mode, collection, item, eventId } = body || {}

  if (!collection) return json({ error: 'collection required' }, { status: 400 })
  if (!eventId && mode === 'create') return json({ error: 'eventId required for create' }, { status: 400 })

  const client = await getBackendClient()

  try {
    if (collection === 'destination_trip') {
      if (mode === 'create') {
        /** @type {Record<string, any>} */
        const tripData = {
          status: 'published'
        }
        
        if (item.destination && item.destination.trim()) {
          tripData.destination = item.destination.trim()
        }
        if (item.departs_from && item.departs_from.trim()) {
          tripData.departs_from = item.departs_from.trim()
        }
        if (item.departs_on) {
          tripData.departs_on = item.departs_on
        }
        if (item.departs_at) {
          tripData.departs_at = item.departs_at
        }
        if (item.arrives_at) {
          tripData.arrives_at = item.arrives_at
        }
        
        const variables = { trip: tripData }
        const resp = await client.query(Queries.CREATE_DESTINATION_TRIP_MUTATION, variables)
        
        if (resp?.errors) {
          console.error('GraphQL errors creating destination trip:', resp.errors)
          return json({ error: 'GraphQL errors', details: resp.errors }, { status: 500 })
        }
        
        // Link trip to event
        const createdTripId = resp?.data?.create_destination_trip_item?.id || resp?.create_destination_trip_item?.id
        
        if (createdTripId && eventId) {
          try {
            const linkMutation = `mutation {
              create_event_trips_item(data: { 
                event_id: { id: "${eventId}" },
                item: "${createdTripId}",
                collection: "destination_trip"
              }) {
                id
              }
            }`
            
            const linkResp = await client.query(linkMutation, {})
            
            if (linkResp?.errors) {
              console.error('Failed to link trip to event:', linkResp.errors)
            }
          } catch (linkErr) {
            console.error('Error linking trip to event:', linkErr)
          }
        }
        
        return json(resp)
        
      } else if (mode === 'edit') {
        /** @type {Record<string, any>} */
        const tripData = {}
        
        if (item.destination !== undefined) tripData.destination = item.destination
        if (item.departs_from !== undefined) tripData.departs_from = item.departs_from
        if (item.departs_on !== undefined) tripData.departs_on = item.departs_on
        if (item.departs_at !== undefined) tripData.departs_at = item.departs_at
        if (item.arrives_at !== undefined) tripData.arrives_at = item.arrives_at
        
        const variables = { id: String(item.id), trip: tripData }
        const resp = await client.query(Queries.UPDATE_DESTINATION_TRIP_MUTATION, variables)
        
        if (resp?.errors) {
          console.error('GraphQL errors updating destination trip:', resp.errors)
          return json({ error: 'GraphQL errors', details: resp.errors }, { status: 500 })
        }
        return json(resp)
      }
    }

    if (collection === 'return_trip') {
      if (mode === 'create') {
        /** @type {Record<string, any>} */
        const tripData = {
          status: 'published'
        }
        
        if (item.destination && item.destination.trim()) {
          tripData.destination = item.destination.trim()
        }
        if (item.departs_from && item.departs_from.trim()) {
          tripData.departs_from = item.departs_from.trim()
        }
        if (item.departs_on) {
          tripData.departs_on = item.departs_on
        }
        if (item.departs_at) {
          tripData.departs_at = item.departs_at
        }
        if (item.arrives_at) {
          tripData.arrives_at = item.arrives_at
        }
        
        const variables = { trip: tripData }
        const resp = await client.query(Queries.CREATE_RETURN_TRIP_MUTATION, variables)
        
        if (resp?.errors) {
          console.error('GraphQL errors creating return trip:', resp.errors)
          return json({ error: 'GraphQL errors', details: resp.errors }, { status: 500 })
        }
        
        // Link trip to event
        const createdTripId = resp?.data?.create_return_trip_item?.id || resp?.create_return_trip_item?.id
        
        if (createdTripId && eventId) {
          try {
            const linkMutation = `mutation {
              create_event_trips_item(data: { 
                event_id: { id: "${eventId}" },
                item: "${createdTripId}",
                collection: "return_trip"
              }) {
                id
              }
            }`
            
            const linkResp = await client.query(linkMutation, {})
            
            if (linkResp?.errors) {
              console.error('Failed to link trip to event:', linkResp.errors)
            }
          } catch (linkErr) {
            console.error('Error linking trip to event:', linkErr)
          }
        }
        
        return json(resp)
        
      } else if (mode === 'edit') {
        /** @type {Record<string, any>} */
        const tripData = {}
        
        if (item.destination !== undefined) tripData.destination = item.destination
        if (item.departs_from !== undefined) tripData.departs_from = item.departs_from
        if (item.departs_on !== undefined) tripData.departs_on = item.departs_on
        if (item.departs_at !== undefined) tripData.departs_at = item.departs_at
        if (item.arrives_at !== undefined) tripData.arrives_at = item.arrives_at
        
        const variables = { id: String(item.id), trip: tripData }
        const resp = await client.query(Queries.UPDATE_RETURN_TRIP_MUTATION, variables)
        
        if (resp?.errors) {
          console.error('GraphQL errors updating return trip:', resp.errors)
          return json({ error: 'GraphQL errors', details: resp.errors }, { status: 500 })
        }
        return json(resp)
      }
    }

    return json({ error: 'unsupported collection or mode' }, { status: 400 })
  } catch (err) {
    console.error('Error in /api/carpool/trip:', err)
    
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