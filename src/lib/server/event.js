import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

const debug = createDebugMessages('APP:lib/server/event')

const EVENT_QUERY = `{
  event(filter: { status: { _eq: "{{status}}" } }) {
      id
      name
      status
      description
      start_date
      end_date
      location
  }
}`

const EVENT_BY_ID_QUERY = `{
  event_by_id(id: "{{id}}") {
        id
        start_date
        end_date
        name
        description
        status
        location
        trips {
            item {
                ... on destination_trip {
                    destination
                    departs_from
                    departs_on
                    departs_at
                    status
                    rides {
                        item {
                            ... on trip_ride {
                                id
                                ride {
                                    vehicle_type
                                    name
                                    seats
                                    driver {
                                        item {
                                            ... on users {
                                                id
                                                firstname
                                                lastname
                                                email_address
                                                phone_number
                                                photo {
                                                    id
                                                    filename_disk
                                                    filename_download
                                                }
                                            }
                                        }
                                        id
                                        collection
                                    }
                                    id
                                }
                                riders {
                                    item {
                                        ... on users {
                                            id
                                            firstname
                                            lastname
                                            email_address
                                            phone_number
                                            photo {
                                                id
                                                filename_disk
                                                filename_download
                                            }
                                        }
                                    }
                                    id
                                    collection
                                }
                                id
                                riders_func {
                                    count
                                }
                            }
                        }
                        collection
                    }
                    id
                    status
                    rides_func {
                        count
                    }
                }
                ... on return_trip {
                    id
                    status
                    destination
                    departs_from
                    departs_on
                    departs_at
                    rides {
                        item {
                            ... on trip_ride {
                                id
                                ride {
                                    vehicle_type
                                    name
                                    seats
                                    driver {
                                        item {
                                            ... on users {
                                                id
                                                firstname
                                                lastname
                                                email_address
                                                phone_number
                                                photo {
                                                    id
                                                    filename_disk
                                                    filename_download
                                                }
                                            }
                                        }
                                        id
                                        collection
                                    }
                                    id
                                }
                                riders {
                                    item {
                                        ... on users {
                                            id
                                            firstname
                                            lastname
                                            email_address
                                            phone_number
                                            photo {
                                                id
                                                filename_disk
                                                filename_download
                                            }
                                        }
                                    }
                                    id
                                    collection
                                }
                                id
                                riders_func {
                                    count
                                }
                            }
                        }
                        collection
                    }
                    id
                    status
                    rides_func {
                        count
                    }
                }
            }
            id
            collection
        }
    }
}`

// GraphQL mutation for creating a new event
const CREATE_EVENT_MUTATION = `mutation ($event: create_event_input!) {
  create_event_item(data: $event) {
    id
    name
    status
    description
    start_date
    end_date
    location
  }
}`

// GraphQL mutation for updating an existing event
const UPDATE_EVENT_MUTATION = `mutation ($id: ID!, $event: update_event_input!) {
  update_event_item(id: $id, data: $event) {
    id
    name
    status
    description
    start_date
    end_date
    location
  }
}`

// GraphQL mutation for deleting an event
const DELETE_EVENT_MUTATION = `mutation ($id: ID!) {
  delete_event_item(id: $id) {
    id
  }
}`

// GraphQL mutation for creating a destination trip
const CREATE_DESTINATION_TRIP_MUTATION = `mutation ($trip: create_destination_trip_input!) {
  create_destination_trip_item(data: $trip) {
    id
    destination
    departs_from
    departs_on
    departs_at
    status
    event {
      id
    }
  }
}`

// GraphQL mutation for updating a destination trip
const UPDATE_DESTINATION_TRIP_MUTATION = `mutation ($id: ID!, $trip: update_destination_trip_input!) {
  update_destination_trip_item(id: $id, data: $trip) {
    id
    destination
    departs_from
    departs_on
    departs_at
    status
  }
}`

// GraphQL mutation for creating a return trip
const CREATE_RETURN_TRIP_MUTATION = `mutation ($trip: create_return_trip_input!) {
  create_return_trip_item(data: $trip) {
    id
    destination
    departs_from
    departs_on
    departs_at
    status
    event {
      id
    }
  }
}`

// GraphQL mutation for updating a return trip
const UPDATE_RETURN_TRIP_MUTATION = `mutation ($id: ID!, $trip: update_return_trip_input!) {
  update_return_trip_item(id: $id, data: $trip) {
    id
    destination
    departs_from
    departs_on
    departs_at
    status
  }
}`

// GraphQL mutation for deleting a trip (works for both destination and return trips)
const DELETE_TRIP_MUTATION = `mutation ($collection: String!, $id: ID!) {
  delete_item(collection: $collection, id: $id) {
    id
  }
}`

// GraphQL mutation for creating a trip ride
const CREATE_TRIP_RIDE_MUTATION = `mutation ($tripRide: create_trip_ride_input!) {
  create_trip_ride_item(data: $tripRide) {
    id
    ride {
      id
      vehicle_type
      name
      seats
    }
    trip {
      id
      collection
    }
  }
}`

// GraphQL mutation for updating a trip ride
const UPDATE_TRIP_RIDE_MUTATION = `mutation ($id: ID!, $tripRide: update_trip_ride_input!) {
  update_trip_ride_item(id: $id, data: $tripRide) {
    id
    ride {
      id
      vehicle_type
      name
      seats
    }
  }
}`

// GraphQL mutation for deleting a trip ride
const DELETE_TRIP_RIDE_MUTATION = `mutation ($id: ID!) {
  delete_trip_ride_item(id: $id) {
    id
  }
}`

// GraphQL mutation for adding a rider to a trip ride
const ADD_RIDER_MUTATION = `mutation ($tripRideId: ID!, $userId: ID!) {
  update_trip_ride_item(
    id: $tripRideId, 
    data: { 
      riders: { 
        create: [{ 
          item: { 
            id: $userId, 
            collection: "users" 
          } 
        }] 
      } 
    }
  ) {
    id
    riders_func {
      count
    }
  }
}`

// GraphQL mutation for removing a rider from a trip ride
const REMOVE_RIDER_MUTATION = `mutation ($tripRideId: ID!, $relationshipId: ID!) {
  update_trip_ride_item(
    id: $tripRideId, 
    data: { 
      riders: { 
        delete: [$relationshipId] 
      } 
    }
  ) {
    id
    riders_func {
      count
    }
  }
}`

export default class Event {
  /**
   * Get events from Directus.
   *
   * @param {string} [status='published'] - The status of the events to retrieve.
   * @param {*} [query=PAGE_QUERY] - The GraphQL query to use. It should contain a placeholder for the status.
   *
   * @returns {Promise<EventsList>}
   *
   * @throws {Error} if failed to retrieve events.
   */
  static async getEvents(status = 'published', query = EVENT_QUERY) {
    const client = await getBackendClient()

    query = query.replace('{{status}}', status)

    debug(`getEvents(status=${status}) query: ${query}`)

    let result
    try {
      result = await client.query(query)
      debug(`getEvents(status=${status}) resp: ${JSON.stringify(result)}`)
      result = result?.event || [] // ensure we have an empty array if no events found
    } catch (/** @type {any} */ err) {
      throw new Error(`failed to retrieve events: ${JSON.stringify(err)}`)
    }
    debug(`getEvents(status=${status}) result: ${JSON.stringify(result)}`)
    // console.log(result)
    return result
  }

  /**
   * Get a single event by ID.
   *
   * @param {string} id - The ID of the event to retrieve.
   * @param {string} [query=EVENT_BY_ID_QUERY] - The GraphQL query to use. It should contain a placeholder for the ID.
   * @returns {Promise<EventRecord|undefined>} - The event record if found, otherwise undefined.
   */
  static async getEventById(id, query = EVENT_BY_ID_QUERY) {
    if (!id) {
      throw new Error('Event ID is required')
    }
    const client = await getBackendClient()
    query = query.replace('{{id}}', id)
    debug(`getEventById(id=${id}) query: ${query}`)
    let result
    try {
      result = await client.query(query)
      debug(`getEventById(id=${id}) resp: ${JSON.stringify(result)}`)
      result = result?.event_by_id || {} // ensure we have an empty object if no event found
    } catch (/** @type {any} */ err) {
      throw new Error(`failed to retrieve event by ID: ${JSON.stringify(err)}`)
    }
    debug(`getEventById(id=${id}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Create a new event in Directus.
   *
   * @param {Object} eventData - The event data to create.
   * @param {string} eventData.name - The name of the event.
   * @param {string} eventData.description - The description of the event.
   * @param {string} eventData.start_date - The start date of the event (ISO format).
   * @param {string} eventData.end_date - The end date of the event (ISO format).
   * @param {string} eventData.location - The location of the event.
   * @param {string} [eventData.status='draft'] - The status of the event.
   * @param {string} [mutation=CREATE_EVENT_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<EventRecord>} - The created event record.
   * 
   * @throws {Error} if failed to create the event.
   */
  static async createEvent(eventData, mutation = CREATE_EVENT_MUTATION) {
    if (!eventData.name) {
      throw new Error('Event name is required')
    }

    // Set default status if not provided
    if (!eventData.status) {
      eventData.status = 'draft'
    }

    const client = await getBackendClient()
    
    const variables = {
      event: {
        ...eventData
      }
    }

    debug(`createEvent() mutation: ${mutation}`)
    debug(`createEvent() variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`createEvent() resp: ${JSON.stringify(result)}`)
      result = result?.create_event_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create event: ${JSON.stringify(err)}`)
    }

    debug(`createEvent() result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Update an existing event in Directus.
   *
   * @param {string} id - The ID of the event to update.
   * @param {Object} eventData - The event data to update.
   * @param {string} [eventData.name] - The name of the event.
   * @param {string} [eventData.description] - The description of the event.
   * @param {string} [eventData.start_date] - The start date of the event (ISO format).
   * @param {string} [eventData.end_date] - The end date of the event (ISO format).
   * @param {string} [eventData.location] - The location of the event.
   * @param {string} [eventData.status] - The status of the event.
   * @param {string} [mutation=UPDATE_EVENT_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<EventRecord>} - The updated event record.
   * 
   * @throws {Error} if failed to update the event.
   */
  static async updateEvent(id, eventData, mutation = UPDATE_EVENT_MUTATION) {
    if (!id) {
      throw new Error('Event ID is required')
    }

    if (Object.keys(eventData).length === 0) {
      throw new Error('No event data provided for update')
    }

    const client = await getBackendClient()
    
    const variables = {
      id,
      event: {
        ...eventData
      }
    }

    debug(`updateEvent(id=${id}) mutation: ${mutation}`)
    debug(`updateEvent(id=${id}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`updateEvent(id=${id}) resp: ${JSON.stringify(result)}`)
      result = result?.update_event_item || {}
    } catch (/** @type {any} */ err) {
      console.error('Error updating event', err)
      throw new Error(`Failed to update event: ${JSON.stringify(err)}`)
    }

    debug(`updateEvent(id=${id}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Archive an event by changing its status to 'archived'.
   *
   * @param {string} id - The ID of the event to archive.
   * @param {string} [mutation=UPDATE_EVENT_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<EventRecord>} - The archived event record.
   * 
   * @throws {Error} if failed to archive the event.
   */
  static async archiveEvent(id, mutation = UPDATE_EVENT_MUTATION) {
    if (!id) {
      throw new Error('Event ID is required')
    }

    return this.updateEvent(id, { status: 'archived' }, mutation)
  }

  /**
   * Delete an event from Directus.
   *
   * @param {string} id - The ID of the event to delete.
   * @param {string} [mutation=DELETE_EVENT_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<{id: string}>} - Object containing the ID of the deleted event.
   * 
   * @throws {Error} if failed to delete the event.
   */
  static async deleteEvent(id, mutation = DELETE_EVENT_MUTATION) {
    if (!id) {
      throw new Error('Event ID is required')
    }

    const client = await getBackendClient()
    
    const variables = {
      id
    }

    debug(`deleteEvent(id=${id}) mutation: ${mutation}`)
    debug(`deleteEvent(id=${id}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`deleteEvent(id=${id}) resp: ${JSON.stringify(result)}`)
      result = result?.delete_event_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to delete event: ${JSON.stringify(err)}`)
    }

    debug(`deleteEvent(id=${id}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Create a new destination trip for an event.
   *
   * @param {string} eventId - The ID of the event to create a trip for.
   * @param {Object} tripData - The trip data.
   * @param {string} tripData.destination - The destination of the trip.
   * @param {string} tripData.departs_from - The departure location.
   * @param {string} tripData.departs_on - The departure date (ISO format).
   * @param {string} tripData.departs_at - The departure time.
   * @param {string} [tripData.status='published'] - The status of the trip.
   * @param {string} [mutation=CREATE_DESTINATION_TRIP_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<Object>} - The created trip.
   * 
   * @throws {Error} if failed to create the trip.
   */
  static async createDestinationTrip(eventId, tripData, mutation = CREATE_DESTINATION_TRIP_MUTATION) {
    if (!eventId) {
      throw new Error('Event ID is required')
    }

    if (!tripData.destination || !tripData.departs_from || !tripData.departs_on || !tripData.departs_at) {
      throw new Error('Trip destination, departure location, date, and time are required')
    }

    // Set default status if not provided
    if (!tripData.status) {
      tripData.status = 'published'
    }

    const client = await getBackendClient()
    
    const variables = {
      trip: {
        ...tripData,
        event: {
          id: eventId
        }
      }
    }

    debug(`createDestinationTrip(eventId=${eventId}) mutation: ${mutation}`)
    debug(`createDestinationTrip(eventId=${eventId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`createDestinationTrip(eventId=${eventId}) resp: ${JSON.stringify(result)}`)
      result = result?.create_destination_trip_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create destination trip: ${JSON.stringify(err)}`)
    }

    debug(`createDestinationTrip(eventId=${eventId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Create a new return trip for an event.
   *
   * @param {string} eventId - The ID of the event to create a trip for.
   * @param {Object} tripData - The trip data.
   * @param {string} tripData.destination - The destination of the trip.
   * @param {string} tripData.departs_from - The departure location.
   * @param {string} tripData.departs_on - The departure date (ISO format).
   * @param {string} tripData.departs_at - The departure time.
   * @param {string} [tripData.status='published'] - The status of the trip.
   * @param {string} [mutation=CREATE_RETURN_TRIP_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<Object>} - The created trip.
   * 
   * @throws {Error} if failed to create the trip.
   */
  static async createReturnTrip(eventId, tripData, mutation = CREATE_RETURN_TRIP_MUTATION) {
    if (!eventId) {
      throw new Error('Event ID is required')
    }

    if (!tripData.destination || !tripData.departs_from || !tripData.departs_on || !tripData.departs_at) {
      throw new Error('Trip destination, departure location, date, and time are required')
    }

    // Set default status if not provided
    if (!tripData.status) {
      tripData.status = 'published'
    }

    const client = await getBackendClient()
    
    const variables = {
      trip: {
        ...tripData,
        event: {
          id: eventId
        }
      }
    }

    debug(`createReturnTrip(eventId=${eventId}) mutation: ${mutation}`)
    debug(`createReturnTrip(eventId=${eventId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`createReturnTrip(eventId=${eventId}) resp: ${JSON.stringify(result)}`)
      result = result?.create_return_trip_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create return trip: ${JSON.stringify(err)}`)
    }

    debug(`createReturnTrip(eventId=${eventId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Update an existing destination trip.
   *
   * @param {string} tripId - The ID of the trip to update.
   * @param {Object} tripData - The trip data to update.
   * @param {string} [tripData.destination] - The destination of the trip.
   * @param {string} [tripData.departs_from] - The departure location.
   * @param {string} [tripData.departs_on] - The departure date (ISO format).
   * @param {string} [tripData.departs_at] - The departure time.
   * @param {string} [tripData.status] - The status of the trip.
   * @param {string} [mutation=UPDATE_DESTINATION_TRIP_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<Object>} - The updated trip.
   * 
   * @throws {Error} if failed to update the trip.
   */
  static async updateDestinationTrip(tripId, tripData, mutation = UPDATE_DESTINATION_TRIP_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (Object.keys(tripData).length === 0) {
      throw new Error('No trip data provided for update')
    }

    const client = await getBackendClient()
    
    const variables = {
      id: tripId,
      trip: {
        ...tripData
      }
    }

    debug(`updateDestinationTrip(tripId=${tripId}) mutation: ${mutation}`)
    debug(`updateDestinationTrip(tripId=${tripId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`updateDestinationTrip(tripId=${tripId}) resp: ${JSON.stringify(result)}`)
      result = result?.update_destination_trip_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to update destination trip: ${JSON.stringify(err)}`)
    }

    debug(`updateDestinationTrip(tripId=${tripId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Update an existing return trip.
   *
   * @param {string} tripId - The ID of the trip to update.
   * @param {Object} tripData - The trip data to update.
   * @param {string} [tripData.destination] - The destination of the trip.
   * @param {string} [tripData.departs_from] - The departure location.
   * @param {string} [tripData.departs_on] - The departure date (ISO format).
   * @param {string} [tripData.departs_at] - The departure time.
   * @param {string} [tripData.status] - The status of the trip.
   * @param {string} [mutation=UPDATE_RETURN_TRIP_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<Object>} - The updated trip.
   * 
   * @throws {Error} if failed to update the trip.
   */
  static async updateReturnTrip(tripId, tripData, mutation = UPDATE_RETURN_TRIP_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (Object.keys(tripData).length === 0) {
      throw new Error('No trip data provided for update')
    }

    const client = await getBackendClient()
    
    const variables = {
      id: tripId,
      trip: {
        ...tripData
      }
    }

    debug(`updateReturnTrip(tripId=${tripId}) mutation: ${mutation}`)
    debug(`updateReturnTrip(tripId=${tripId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`updateReturnTrip(tripId=${tripId}) resp: ${JSON.stringify(result)}`)
      result = result?.update_return_trip_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to update return trip: ${JSON.stringify(err)}`)
    }

    debug(`updateReturnTrip(tripId=${tripId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Delete a trip (works for both destination and return trips).
   *
   * @param {string} tripId - The ID of the trip to delete.
   * @param {string} collection - The collection name ('destination_trip' or 'return_trip').
   * @param {string} [mutation=DELETE_TRIP_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<{id: string}>} - Object containing the ID of the deleted trip.
   * 
   * @throws {Error} if failed to delete the trip.
   */
  static async deleteTrip(tripId, collection, mutation = DELETE_TRIP_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (!collection || (collection !== 'destination_trip' && collection !== 'return_trip')) {
      throw new Error('Valid collection name is required (destination_trip or return_trip)')
    }

    const client = await getBackendClient()
    
    const variables = {
      id: tripId,
      collection
    }

    debug(`deleteTrip(tripId=${tripId}, collection=${collection}) mutation: ${mutation}`)
    debug(`deleteTrip(tripId=${tripId}, collection=${collection}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`deleteTrip(tripId=${tripId}, collection=${collection}) resp: ${JSON.stringify(result)}`)
      result = result?.delete_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to delete trip: ${JSON.stringify(err)}`)
    }

    debug(`deleteTrip(tripId=${tripId}, collection=${collection}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Create a new trip ride for a trip.
   *
   * @param {string} tripId - The ID of the trip to create a ride for.
   * @param {string} tripCollection - The collection name ('destination_trip' or 'return_trip').
   * @param {Object} rideData - The ride data.
   * @param {Object} rideData.ride - The ride information.
   * @param {string} rideData.ride.vehicle_type - The type of vehicle.
   * @param {string} rideData.ride.name - The name of the ride.
   * @param {number} rideData.ride.seats - The number of seats available.
   * @param {Object} [rideData.ride.driver] - The driver information.
   * @param {string} rideData.ride.driver.id - The ID of the driver user.
   * @param {string} [mutation=CREATE_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<Object>} - The created trip ride.
   * 
   * @throws {Error} if failed to create the trip ride.
   */
  static async createTripRide(tripId, tripCollection, rideData, mutation = CREATE_TRIP_RIDE_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (!tripCollection || (tripCollection !== 'destination_trip' && tripCollection !== 'return_trip')) {
      throw new Error('Valid trip collection name is required (destination_trip or return_trip)')
    }

    if (!rideData.ride || !rideData.ride.vehicle_type || !rideData.ride.name || !rideData.ride.seats) {
      throw new Error('Ride vehicle type, name, and seats are required')
    }

    const client = await getBackendClient()
    
    // Format the ride data for the mutation
    const tripRideData = {
      ride: rideData.ride,
      trip: {
        id: tripId,
        collection: tripCollection
      }
    }

    const variables = {
      tripRide: tripRideData
    }

    debug(`createTripRide(tripId=${tripId}) mutation: ${mutation}`)
    debug(`createTripRide(tripId=${tripId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.mutation(mutation, variables)
      debug(`createTripRide(tripId=${tripId}) resp: ${JSON.stringify(result)}`)
      result = result?.create_trip_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create trip ride: ${JSON.stringify(err)}`)
    }

    debug(`createTripRide(tripId=${tripId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Update an existing trip ride.
   *
   * @param {string} tripRideId - The ID of the trip ride to update.
   * @param {Object} rideData - The ride data to update.
   * @param {Object} [rideData.ride] - The ride information.
   * @param {string} [rideData.ride.vehicle_type] - The type of vehicle.
   * @param {string} [rideData.ride.name] - The name of the ride.
   * @param {number} [rideData.ride.seats] - The number of seats available.
   * @param {Object} [rideData.ride.driver] - The driver information.
   * @param {string} [rideData.ride.driver.id] - The ID of the driver user.
   * @param {string} [mutation=UPDATE_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<Object>} - The updated trip ride.
   * 
   * @throws {Error} if failed to update the trip ride.
   */
  static async updateTripRide(tripRideId, rideData, mutation = UPDATE_TRIP_RIDE_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    if (Object.keys(rideData).length === 0) {
      throw new Error('No ride data provided for update')
    }

    const client = await getBackendClient()
    
    const variables = {
      id: tripRideId,
      tripRide: rideData
    }

    debug(`updateTripRide(tripRideId=${tripRideId}) mutation: ${mutation}`)
    debug(`updateTripRide(tripRideId=${tripRideId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.mutation(mutation, variables)
      debug(`updateTripRide(tripRideId=${tripRideId}) resp: ${JSON.stringify(result)}`)
      result = result?.update_trip_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to update trip ride: ${JSON.stringify(err)}`)
    }

    debug(`updateTripRide(tripRideId=${tripRideId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Delete a trip ride.
   *
   * @param {string} tripRideId - The ID of the trip ride to delete.
   * @param {string} [mutation=DELETE_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<{id: string}>} - Object containing the ID of the deleted trip ride.
   * 
   * @throws {Error} if failed to delete the trip ride.
   */
  static async deleteTripRide(tripRideId, mutation = DELETE_TRIP_RIDE_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    const client = await getBackendClient()
    
    const variables = {
      id: tripRideId
    }

    debug(`deleteTripRide(tripRideId=${tripRideId}) mutation: ${mutation}`)
    debug(`deleteTripRide(tripRideId=${tripRideId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.mutation(mutation, variables)
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
   * @param {string} [mutation=ADD_RIDER_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<Object>} - The updated trip ride with rider count.
   * 
   * @throws {Error} if failed to add the rider.
   */
  static async addRiderToTripRide(tripRideId, userId, mutation = ADD_RIDER_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    if (!userId) {
      throw new Error('User ID is required')
    }

    const client = await getBackendClient()
    
    const variables = {
      tripRideId,
      userId
    }

    debug(`addRiderToTripRide(tripRideId=${tripRideId}, userId=${userId}) mutation: ${mutation}`)
    debug(`addRiderToTripRide(tripRideId=${tripRideId}, userId=${userId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.mutation(mutation, variables)
      debug(`addRiderToTripRide(tripRideId=${tripRideId}, userId=${userId}) resp: ${JSON.stringify(result)}`)
      result = result?.update_trip_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to add rider to trip ride: ${JSON.stringify(err)}`)
    }

    debug(`addRiderToTripRide(tripRideId=${tripRideId}, userId=${userId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Remove a rider from a trip ride.
   *
   * @param {string} tripRideId - The ID of the trip ride.
   * @param {string} relationshipId - The ID of the relationship to remove.
   * @param {string} [mutation=REMOVE_RIDER_MUTATION] - The GraphQL mutation to use.
   * 
   * @returns {Promise<Object>} - The updated trip ride with rider count.
   * 
   * @throws {Error} if failed to remove the rider.
   */
  static async removeRiderFromTripRide(tripRideId, relationshipId, mutation = REMOVE_RIDER_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    if (!relationshipId) {
      throw new Error('Relationship ID is required')
    }

    const client = await getBackendClient()
    
    const variables = {
      tripRideId,
      relationshipId
    }

    debug(`removeRiderFromTripRide(tripRideId=${tripRideId}, relationshipId=${relationshipId}) mutation: ${mutation}`)
    debug(`removeRiderFromTripRide(tripRideId=${tripRideId}, relationshipId=${relationshipId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.mutation(mutation, variables)
      debug(`removeRiderFromTripRide(tripRideId=${tripRideId}, relationshipId=${relationshipId}) resp: ${JSON.stringify(result)}`)
      result = result?.update_trip_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to remove rider from trip ride: ${JSON.stringify(err)}`)
    }

    debug(`removeRiderFromTripRide(tripRideId=${tripRideId}, relationshipId=${relationshipId}) result: ${JSON.stringify(result)}`)
    return result
  }
}

/**
 * @typedef {Object} EventRecord
 *
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} description
 * @property {string} start_date
 * @property {string} end_date
 * @property {string} status
 */

/**
 * @typedef {Array.<EventRecord>} EventsList
 */

/**
 * @typedef {Object} TripRecord
 * 
 * @property {string} id
 * @property {string} destination
 * @property {string} departs_from
 * @property {string} departs_on
 * @property {string} departs_at
 * @property {string} status
 * @property {string} collection - Either 'destination_trip' or 'return_trip'
 * @property {Array.<TripRideRecord>} [rides]
 */

/**
 * @typedef {Object} TripRideRecord
 * 
 * @property {string} id
 * @property {RideRecord} ride
 * @property {Object} trip
 * @property {Array.<UserRecord>} [riders]
 */

/**
 * @typedef {Object} RideRecord
 * 
 * @property {string} id
 * @property {string} vehicle_type
 * @property {string} name
 * @property {number} seats
 * @property {Object} [driver]
 */

/**
 * @typedef {Object} UserRecord
 * 
 * @property {string} id
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email_address
 * @property {string} [phone_number]
 * @property {Object} [photo]
 */
