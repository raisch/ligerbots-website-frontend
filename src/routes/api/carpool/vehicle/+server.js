import { json } from '@sveltejs/kit'
import { getBackendClient } from '$lib/server/client'
import Queries from '$lib/server/graphql/event'
import { CREATE_RIDE_MUTATION } from '$lib/server/graphql/ride.js'
import User from '$lib/server/user.js'
import Vehicle from '$lib/server/vehicle.js'

export async function POST({ request }) {
  const body = await request.json()
  const { mode, item } = body || {}

  const client = await getBackendClient()

  try {
    if (mode === 'create') {
      /** @type {Record<string, any> & { name: string, vehicle_type: string, seats: number, driver: import('$lib/server/user.js').UserRecord }} */
      // @ts-ignore
      const vehicleData = {
        status: 'published'
      }
      
      if (item.name && item.name.trim()) vehicleData.name = item.name.trim()
      if (item.type && item.type.trim()) vehicleData.vehicle_type = item.type.trim()
      if (item.seats) vehicleData.seats = item.seats
      // @ts-ignore
      if (item.driver) vehicleData.driver = await User.findById(item.driver)
      if (!vehicleData.driver) {
        return json({ error: 'Invalid driver specified' }, { status: 400 })
      }
      
      const resp = await Vehicle.createVehicle(vehicleData)
      
      return json(resp)
      
    } else if (mode === 'edit') {
      /** @type {Record<string, any> & { name?: string, vehicle_type?: string, seats?: number, driver?: import('$lib/server/user.js').UserRecord }} */
      // @ts-ignore
      const vehicleData = {
        status: 'published'
      }
      

      if (item.name && item.name.trim()) vehicleData.name = item.name.trim()
      if (item.type && item.type.trim()) vehicleData.vehicle_type = item.type.trim()
      if (item.seats) vehicleData.seats = item.seats
      // @ts-ignore
      if (item.driver) vehicleData.driver = await User.findById(item.driver)
      
      if (!vehicleData.driver) {
        return json({ error: 'Invalid driver specified' }, { status: 400 })
      }
      
      const resp = await Vehicle.updateVehicle({id: item.id, ...vehicleData})
      
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