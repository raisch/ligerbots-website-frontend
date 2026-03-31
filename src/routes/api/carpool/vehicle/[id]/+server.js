import { json } from '@sveltejs/kit'
import Vehicle from '$lib/server/vehicle.js'

export async function DELETE({ params }) {
  try {
    await Vehicle.deleteVehicle(params.id)
    return json({ success: true })
  } catch (err) {
    console.error('Error deleting vehicle:', err)
    return json({ error: 'Failed to delete vehicle' }, { status: 500 })
  }
}