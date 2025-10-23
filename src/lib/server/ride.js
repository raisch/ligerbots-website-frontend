import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

import Queries from '$lib/server/graphql/event'

const debug = createDebugMessages('APP:lib/server/ride')

export default class Ride {
    /**
     * Get all rides.
     *
     * @param {string} [query] - Custom GraphQL query to use.
     *
     * @returns {Promise<any[]>} - Array of ride records.
     *
     * @throws {Error} if failed to retrieve rides.
     */
    static async getAllRides(query = Queries.GET_ALL_RIDES_QUERY) {
        const client = await getBackendClient()

        debug(`getAllRides() query: ${query}`)

        let result
        try {
            result = await client.query(query, {})
            debug(`getAllRides() resp: ${JSON.stringify(result)}`)
            result = result?.ride || []
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to retrieve rides: ${JSON.stringify(err)}`)
        }

        debug(`getAllRides() result: ${JSON.stringify(result)}`)
        return result
    }

    /**
     * Get a ride by ID.
     *
     * @param {string} rideId - The ID of the ride to retrieve.
     * @param {string} [query] - Custom GraphQL query to use.
     *
     * @returns {Promise<Object>} - The ride record.
     *
     * @throws {Error} if failed to retrieve the ride.
     */
    static async getRideById(rideId, query = Queries.GET_RIDE_BY_ID_QUERY) {
        if (!rideId) {
            throw new Error('Ride ID is required')
        }

        const client = await getBackendClient()

        const variables = {
            id: rideId
        }

        debug(`getRideById(rideId=${rideId}) query: ${query}`)
        debug(`getRideById(rideId=${rideId}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(query, variables)
            debug(`getRideById(rideId=${rideId}) resp: ${JSON.stringify(result)}`)
            result = result?.ride_by_id || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to retrieve ride: ${JSON.stringify(err)}`)
        }

        debug(`getRideById(rideId=${rideId}) result: ${JSON.stringify(result)}`)
        return result
    }

    /**
     * Create a new ride.
     *
     * @param {Object} rideData - The ride data to create.
     *
     * @returns {Promise<Object>} - The created ride record.
     *
     * @throws {Error} if failed to create the ride.
     */
    static async createRide(rideData) {
        if (!rideData) {
            throw new Error('Ride data is required')
        }

        const client = await getBackendClient()

        const variables = {
            ride: rideData
        }

        debug(`createRide() variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(Queries.CREATE_RIDE_MUTATION, variables)
            debug(`createRide() resp: ${JSON.stringify(result)}`)
            result = result?.create_ride_item || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to create ride: ${JSON.stringify(err)}`)
        }

        debug(`createRide() result: ${JSON.stringify(result)}`)
        return result
    }

    /**
     * Update an existing ride.
     *
     * @param {any} rideData - The ride data to update (must include id).
     *
     * @returns {Promise<Object>} - The updated ride record.
     *
     * @throws {Error} if failed to update the ride.
     */
    static async updateRide(rideData) {
        if (!rideData || !rideData.id) {
            throw new Error('Ride data with valid id is required')
        }

        const client = await getBackendClient()

        const variables = {
            id: rideData.id,
            ride: { ...rideData }
        }
        delete variables.ride.id

        debug(`updateRide(rideId=${rideData.id}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(Queries.UPDATE_RIDE_MUTATION, variables)
            debug(`updateRide(rideId=${rideData.id}) resp: ${JSON.stringify(result)}`)
            result = result?.update_ride_item || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to update ride: ${JSON.stringify(err)}`)
        }

        debug(`updateRide(rideId=${rideData.id}) result: ${JSON.stringify(result)}`)
        return result
    }

    /**
     * Delete a ride.
     *
     * @param {string} rideId - The ID of the ride to delete.
     *
     * @returns {Promise<Object>} - The deletion result.
     *
     * @throws {Error} if failed to delete the ride.
     */
    static async deleteRide(rideId) {
        if (!rideId) {
            throw new Error('Ride ID is required')
        }

        const client = await getBackendClient()

        const variables = {
            id: rideId
        }

        debug(`deleteRide(rideId=${rideId}) variables: ${JSON.stringify(variables)}`)

        let result
        try {
            result = await client.query(Queries.DELETE_RIDE_MUTATION, variables)
            debug(`deleteRide(rideId=${rideId}) resp: ${JSON.stringify(result)}`)
            result = result?.delete_ride_item || {}
        } catch (/** @type {any} */ err) {
            throw new Error(`Failed to delete ride: ${JSON.stringify(err)}`)
        }

        debug(`deleteRide(rideId=${rideId}) result: ${JSON.stringify(result)}`)
        return result
    }
}