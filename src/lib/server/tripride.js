import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

import Queries from '$lib/server/graphql/event'

const debug = createDebugMessages('APP:lib/server/tripride')

export default class TripRide {
    /**
     * Get a trip ride by ID.
     *
     * @param {string} tripRideId - The ID of the trip ride to retrieve.
     * @param {string} [query=Queries.GET_TRIP_RIDE_BY_ID_QUERY] - The GraphQL query to use.
     *
     * @returns {Promise<Object>} - The trip ride record.
     *
     * @throws {Error} if failed to retrieve the trip ride.
     */
    static async getTripRideById(tripRideId, query = Queries.GET_TRIP_RIDE_BY_ID_QUERY) {
        if (!tripRideId) {
            throw new Error('Trip ride ID is required')
        }

        const client = await getBackendClient()

        const variables = {
            id: tripRideId
        }

        debug(`getTripRideById(tripRideId=${tripRideId}) query: ${query}`)
        debug(`getTripRideById(tripRideId=${tripRideId}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(query, variables)
            debug(`getTripRideById(tripRideId=${tripRideId}) resp: ${JSON.stringify(result)}`)
            result = result?.trip_ride_by_id || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to retrieve trip ride: ${JSON.stringify(err)}`)
        }

        debug(`getTripRideById(tripRideId=${tripRideId}) result: ${JSON.stringify(result)}`)
        return result
    }

    /**
     * Get trip rides for a specific trip.
     *
     * @param {string} tripId - The ID of the trip.
     * @param {string} tripType - The type of trip (destination_trip or return_trip).
     *
     * @returns {Promise<any[]>} - Array of trip rides.
     *
     * @throws {Error} if failed to retrieve trip rides.
     */
    static async getTripRidesByTrip(tripId, tripType) {
        if (!tripId) {
            throw new Error('Trip ID is required')
        }
        if (!tripType || (tripType !== "destination_trip" && tripType !== "return_trip")) {
            throw new Error('Valid trip type is required (destination_trip or return_trip)')
        }

        const client = await getBackendClient()

        // Use the existing trip queries to get rides
        const mutationName = tripType === "destination_trip" ? "GET_DESTINATION_TRIPS_MUTATION" : "GET_RETURN_TRIPS_MUTATION"
        const query = Queries[mutationName]

        const variables = {
            event_id: tripId
        }

        debug(`getTripRidesByTrip(tripId=${tripId}, tripType=${tripType}) query: ${mutationName}`)
        debug(`getTripRidesByTrip(tripId=${tripId}, tripType=${tripType}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(query, variables)
            debug(`getTripRidesByTrip(tripId=${tripId}, tripType=${tripType}) resp: ${JSON.stringify(result)}`)
            
            // Extract rides from the trip data
            const trips = result?.event_by_id?.trips || []
            const tripData = trips.find((/** @type {any} */ trip) => trip.item?.id === tripId)
            result = tripData?.item?.rides || []
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to retrieve trip rides: ${JSON.stringify(err)}`)
        }

        debug(`getTripRidesByTrip(tripId=${tripId}, tripType=${tripType}) result: ${JSON.stringify(result)}`)
        return result
    }

    /**
     * Create a new trip ride.
     *
     * @param {Object} tripRideData - The trip ride data to create.
     *
     * @returns {Promise<Object>} - The created trip ride record.
     *
     * @throws {Error} if failed to create the trip ride.
     */
    static async createTripRide(tripRideData) {
        if (!tripRideData) {
            throw new Error('Trip ride data is required')
        }

        const client = await getBackendClient()

        const variables = {
            tripRide: tripRideData
        }

        debug(`createTripRide() variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(Queries.CREATE_TRIP_RIDE_MUTATION, variables)
            debug(`createTripRide() resp: ${JSON.stringify(result)}`)
            result = result?.create_trip_ride_item || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to create trip ride: ${JSON.stringify(err)}`)
        }

        debug(`createTripRide() result: ${JSON.stringify(result)}`)
        return result
    }

    /**
     * Update an existing trip ride.
     *
     * @param {any} tripRideData - The trip ride data to update (must include id).
     *
     * @returns {Promise<Object>} - The updated trip ride record.
     *
     * @throws {Error} if failed to update the trip ride.
     */
    static async updateTripRide(tripRideData) {
        if (!tripRideData || !tripRideData.id) {
            throw new Error('Trip ride data with valid id is required')
        }

        const client = await getBackendClient()

        const variables = {
            id: tripRideData.id,
            tripRide: { ...tripRideData }
        }
        delete variables.tripRide.id

        debug(`updateTripRide(tripRideId=${tripRideData.id}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(Queries.UPDATE_TRIP_RIDE_MUTATION, variables)
            debug(`updateTripRide(tripRideId=${tripRideData.id}) resp: ${JSON.stringify(result)}`)
            result = result?.update_trip_ride_item || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to update trip ride: ${JSON.stringify(err)}`)
        }

        debug(`updateTripRide(tripRideId=${tripRideData.id}) result: ${JSON.stringify(result)}`)
        return result
    }

    /**
     * Delete a trip ride.
     *
     * @param {string} tripRideId - The ID of the trip ride to delete.
     *
     * @returns {Promise<Object>} - The deletion result.
     *
     * @throws {Error} if failed to delete the trip ride.
     */
    static async deleteTripRide(tripRideId) {
        if (!tripRideId) {
            throw new Error('Trip ride ID is required')
        }

        const client = await getBackendClient()

        const variables = {
            id: tripRideId
        }

        debug(`deleteTripRide(tripRideId=${tripRideId}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(Queries.DELETE_TRIP_RIDE_MUTATION, variables)
            debug(`deleteTripRide(tripRideId=${tripRideId}) resp: ${JSON.stringify(result)}`)
            result = result?.delete_trip_ride_item || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to delete trip ride: ${JSON.stringify(err)}`)
        }

        debug(`deleteTripRide(tripRideId=${tripRideId}) result: ${JSON.stringify(result)}`)
        return result
    }

    /**
     * Add a rider to a trip ride.
     *
     * @param {string} tripRideId - The ID of the trip ride.
     * @param {string} userId - The ID of the user to add as a rider.
     *
     * @returns {Promise<Object>} - The updated trip ride record.
     *
     * @throws {Error} if failed to add the rider.
     */
    static async addRider(tripRideId, userId) {
        if (!tripRideId) {
            throw new Error('Trip ride ID is required')
        }
        if (!userId) {
            throw new Error('User ID is required')
        }

        const client = await getBackendClient()

        const variables = {
            tripRideId: tripRideId,
            userId: userId
        }

        debug(`addRider(tripRideId=${tripRideId}, userId=${userId}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(Queries.ADD_RIDER_MUTATION, variables)
            debug(`addRider(tripRideId=${tripRideId}, userId=${userId}) resp: ${JSON.stringify(result)}`)
            result = result?.update_trip_ride_item || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to add rider: ${JSON.stringify(err)}`)
        }

        debug(`addRider(tripRideId=${tripRideId}, userId=${userId}) result: ${JSON.stringify(result)}`)
        return result
    }

    /**
     * Remove a rider from a trip ride.
     *
     * @param {string} tripRideId - The ID of the trip ride.
     * @param {string} relationshipId - The ID of the rider relationship to remove.
     *
     * @returns {Promise<Object>} - The updated trip ride record.
     *
     * @throws {Error} if failed to remove the rider.
     */
    static async removeRider(tripRideId, relationshipId) {
        if (!tripRideId) {
            throw new Error('Trip ride ID is required')
        }
        if (!relationshipId) {
            throw new Error('Relationship ID is required')
        }

        const client = await getBackendClient()

        const variables = {
            tripRideId: tripRideId,
            relationshipId: relationshipId
        }

        debug(`removeRider(tripRideId=${tripRideId}, relationshipId=${relationshipId}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(Queries.REMOVE_RIDER_MUTATION, variables)
            debug(`removeRider(tripRideId=${tripRideId}, relationshipId=${relationshipId}) resp: ${JSON.stringify(result)}`)
            result = result?.update_trip_ride_item || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to remove rider: ${JSON.stringify(err)}`)
        }

        debug(`removeRider(tripRideId=${tripRideId}, relationshipId=${relationshipId}) result: ${JSON.stringify(result)}`)
        return result
    }
}