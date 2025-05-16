import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

import Queries from '$lib/server/graphql/event'

const debug = createDebugMessages('APP:lib/server/event')

export default class Trip {
    static async getTrips(eventId, mutation = "destination_trip") {
        if (!eventId) {
            throw new Error('Event ID is required')
        }

        if (mutation !== "destination_trip" && mutation !== "return_trip") {
            throw new Error('Invalid mutation. Choose "destination_trip" or "return_trip"')
        }

        // Convert mutation to query
        mutation = mutation === "destination_trip" ? "GET_DESTINATION_TRIPS_MUTATION" : "GET_RETURN_TRIPS_MUTATION"

        const client = await getBackendClient()

        const variables = {
            event_id: eventId
        }

        debug(`getTrips(eventId=${eventId}) mutation: ${mutation}`)
        debug(`getTrips(eventId=${eventId}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(Queries[mutation], variables)
            debug(`getTrips(eventId=${eventId}) resp: ${JSON.stringify(result)}`)
            result = result?.event_by_id?.trips || []
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to get trips: ${JSON.stringify(err)}`)
        }

        debug(`getTrips(eventId=${eventId}) result: ${JSON.stringify(result)}`)
        return result
    }

    static async updateTrip(tripData, mutation = "destination_trip") {
        if (!tripData || !tripData.id) {
            throw new Error('Trip data with valid id is required')
        }
        if (mutation !== "destination_trip" && mutation !== "return_trip") {
            throw new Error('Invalid mutation. Choose "destination_trip" or "return_trip"')
        }

        const mutationName = mutation === "destination_trip" ? "UPDATE_DESTINATION_TRIP_MUTATION" : "UPDATE_RETURN_TRIP_MUTATION"
        const mutationQuery = Queries[mutationName]

        const client = await getBackendClient()

        const variables = {
            id: tripData.id,
            trip: { ...tripData }
        }
        delete variables.trip.id

        debug(`updateTrip(tripId=${tripData.id}) mutation: ${mutationName}`)
        debug(`updateTrip(tripId=${tripData.id}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(mutationQuery, variables)
            debug(`updateTrip(tripId=${tripData.id}) resp: ${JSON.stringify(result)}`)
            const resultField = mutation === "destination_trip" ? "update_destination_trip_item" : "update_return_trip_item"
            result = result?.[resultField] || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to update trip: ${JSON.stringify(err)}`)
        }

        debug(`updateTrip(tripId=${tripData.id}) result: ${JSON.stringify(result)}`)
        return result
    }
}