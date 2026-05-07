import { json } from '@sveltejs/kit'
import Vehicle from '$lib/server/vehicle.js'
import User from '$lib/server/user'

export async function DELETE({ params, cookies }) {
  const jwt = cookies.get('jwt')
  if (!jwt || !User.validate(jwt)) return new Response('Unauthorized', { status: 401 })

  try {
    await Vehicle.deleteVehicle(params.id)
    return json({ success: true })
  } catch (err) {
    console.error('Error deleting vehicle:', err)
    return json({ error: 'Failed to delete vehicle' }, { status: 500 })
  }
}