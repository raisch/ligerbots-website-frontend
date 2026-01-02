import { json } from '@sveltejs/kit'
import { getBackendClient } from '$lib/server/client'
import Queries from '$lib/server/graphql/event'

/** post to add/remove user from trip rides based on selections */
export async function POST({ request }) {
  const body = await request.json()
  const {
    destinationRideId,
    returnRideId,
    previousDestinationRideId,
    previousReturnRideId,
    userId
  } = body || {}

  if (!userId) {
    return json({ error: 'userId is required' }, { status: 400 })
  }

  const client = await getBackendClient()

  /**
   * @param {string|number} tripRideId
   * @returns {Promise<string|null>}
   */
  async function findRelationshipId(tripRideId) {
    if (!tripRideId || tripRideId === -1) return null
    const resp = await client.query(Queries.GET_TRIP_RIDE_BY_ID_QUERY, { id: String(tripRideId) })
    const trip = resp?.trip_ride_by_id
    if (!trip) return null
    const riders = trip.riders || []
    for (const rel of riders) {
      const item = rel?.item || rel
      const userObj = Array.isArray(item) ? item[0] : item
      if (!userObj) continue
      if (userObj.id === userId || userObj.email_address === userId) {
        return rel.id || null
      }
    }
    return null
  }

  try {
    // Remove previous if changed
    if (previousDestinationRideId && previousDestinationRideId !== destinationRideId && previousDestinationRideId !== -1) {
      const relId = await findRelationshipId(previousDestinationRideId)
      if (relId) {
        await client.query(Queries.REMOVE_RIDER_MUTATION, { relationshipId: relId })
      }
    }

    // Add new if selected and changed
    if (destinationRideId && destinationRideId !== -1 && destinationRideId !== previousDestinationRideId) {
      await client.query(Queries.ADD_RIDER_MUTATION, { tripRideId: String(destinationRideId), userId: String(userId) })
    }

    // Remove previous if changed
    if (previousReturnRideId && previousReturnRideId !== returnRideId && previousReturnRideId !== -1) {
      const relId = await findRelationshipId(previousReturnRideId)
      if (relId) {
        await client.query(Queries.REMOVE_RIDER_MUTATION, { relationshipId: relId })
      }
    }

    // Add new if selected and changed
    if (returnRideId && returnRideId !== -1 && returnRideId !== previousReturnRideId) {
      await client.query(Queries.ADD_RIDER_MUTATION, { tripRideId: String(returnRideId), userId: String(userId) })
    }

    return json({ ok: true })
  } catch (err) {
    console.error('carpool confirm error', err)
    return json({ error: String(err) }, { status: 500 })
  }
}
