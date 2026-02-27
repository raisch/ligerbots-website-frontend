import Joi from 'joi';
import { command } from '$app/server'
import Rider from '$lib/server/rider';
import createDebugMessages from 'debug';
import Ride from '$lib/server/ride';
import Event from '$lib/server/event';
import Trip from '$lib/server/trip';
const debug = createDebugMessages('APP:lib/server/event')

/**
 * @typedef RideRegistrationFormSchema
 * @prop {string} user
 * @prop {string} event
 * @prop {Record<'destination_trip' | 'return_trip', string | null>} rides
 */
const RideRegistrationFormSchema = Joi.object({
  user: Joi.string().pattern(/^[0-9]+$/).required(),
  event: Joi.string().pattern(/^[0-9]+$/).required(),
  rides: Joi.object().pattern(Joi.valid("destination_trip", "return_trip"), Joi.string().pattern(/^[0-9]+$/).required().allow(null)).required()
})

/**
 * @typedef RideRemoveFormSchema
 * @prop {string} user
 * @prop {string?} event
 */
const RideRemoveFormSchema = Joi.object({
  user: Joi.string().pattern(/^[0-9]+$/).required(),
  event: Joi.string().pattern(/^[0-9]+$/).allow(null),
})

/**
 * @typedef AddCarToTripSchema
 * @prop {string} tripId
 * @prop {string} tripCollection
 * @prop {string} rideId
 */
/**
 * @typedef RemoveCarFromTripSchema
 * @prop {string} tripRideId
 * @prop {string} relationshipId
 * @prop {'destination_trip' | 'return_trip'} collection
 */


export const updateRideSelections = command('unchecked', async (/** @type {RideRegistrationFormSchema} */ {event, user, rides}) => {
  debug(`updateRideSelections(event=${event}, user=${user}, rides=${JSON.stringify(rides)})`)
  /**
   * @type {any[]}
   */
  let r = []
  let eventData = await Event.getEventById(event).catch(console.error);
  if (eventData?.attendees?.some(attendee => attendee.users_id.id === user)) {
    r.push(await Event.removeAttendeeFromEvent(event, user).catch(console.error));
    r.push(await Rider.removeRiderFromTrip(event, user).catch(console.error)); // prevent duplicates
  }
  r.push(await Event.addAttendeeToEvent(event, user).catch(console.error));
  Object.entries(rides).forEach(async ([, selection]) => {
    if (selection) {
      r.push(await Rider.addRiderToRide(selection, user).catch(console.error));
    }
  })
  return r
})

export const removeFromRide = command('unchecked', async (/** @type {RideRemoveFormSchema} */ {user, event}) => {
  debug(`removeFromRide(event=${event}, user=${user})`)
  console.log(`removeFromRide(event=${event}, user=${user})`)
  /**
   * @type {any[]}
   */
  let r = []
  if (event) {
    r.push(await Event.removeAttendeeFromEvent(event, user).catch(console.error));
    r.push(await Rider.removeRiderFromTrip(event, user).catch(console.error));
  } else {
    //r.push(await Rider.removeRiderFromAll(user).catch(console.error));
  }
})



export const addCarToTrip = command('unchecked', async (/** @type {AddCarToTripSchema} */ { tripId, tripCollection, rideId }) => {
  try {
    debug(`addCarToTrip(tripId=${tripId}, tripCollection=${tripCollection}, rideId=${rideId})`)
    console.log(`addCarToTrip(tripId=${tripId}, tripCollection=${tripCollection}, rideId=${rideId})`)
    let trip = tripCollection === 'destination_trip' ? await Trip.getDestinationTripById(tripId) : await Trip.getReturnTripById(tripId);
    if (trip.rides?.some(ride => ride.item.ride.id === rideId)) return;
    let ride = await Ride.getRideById(rideId);
    if (!ride) return;

    Event.createTripRide(tripId, tripCollection, {ride: {id: ride.id, vehicle_type: ride.vehicle_type, name: ride.name, seats: ride.seats, driver: [{ id: ride.driver?.[0]?.id, item: JSON.stringify(ride.driver?.[0]?.item) }]}})

    console.log(`Added ride ${rideId} to trip ${tripId} (${tripCollection})`)
  } catch (error) {
    debug(`addCarToTrip(tripId=${tripId}, tripCollection=${tripCollection}, rideId=${rideId}) error: ${error}`)
    console.error(JSON.stringify(error, null, 2))
  }
})

export const removeCarFromTrip = command('unchecked', async (/** @type {RemoveCarFromTripSchema} */ { tripRideId, collection, relationshipId }) => {
  try {
    console.log(`removeCarFromTrip(tripRideId=${tripRideId}, collection=${collection}, relationshipId=${relationshipId})`)
    debug(`removeCarFromTrip(tripRideId=${tripRideId}, collection=${collection}, relationshipId=${relationshipId})`)
    if (!tripRideId && !relationshipId) {
      return;
    }
    Event.deleteTripRide(tripRideId, collection, relationshipId)
    // Event.clearNullTripRides()
  } catch (error) {
    debug(`removeCarFromTrip(tripRideId=${tripRideId}, collection=${collection}, relationshipId=${relationshipId}) error: ${error}`)
    console.error(error)
  }
})