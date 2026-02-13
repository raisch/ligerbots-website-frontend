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
 */


export const updateRideSelections = command('unchecked', async (/** @type {RideRegistrationFormSchema} */ {event, user, rides}) => {
  debug(`updateRideSelections(event=${event}, user=${user}, rides=${JSON.stringify(rides)})`)
  /**
   * @type {any[]}
   */
  let r = []
  Object.entries(rides).forEach(async ([, selection]) => {
    r.push(await Rider.removeRiderFromTrip(event, user).catch(console.error)); // prevent duplicates
    if (selection) {
      r.push(await Rider.addRiderToRide(selection, user).catch(console.error))
    }
  })
  return r
})

export const removeFromRide = command('unchecked', async (/** @type {RideRemoveFormSchema} */ {user, event}) => {
  debug(`removeFromRide(event=${event}, user=${user})`)
  console.log(`removeFromRide(event=${event}, user=${user})`)
  if (event) {
    return Rider.removeRiderFromTrip(event, user).catch(console.error);
  } else {
    return Rider.removeRiderFromAll(user).catch(console.error);
  }
})



export const addCarToTrip = command('unchecked', async (/** @type {AddCarToTripSchema} */ { tripId, tripCollection, rideId }) => {
  debug(`addCarToTrip()`)
  let trip = await Trip.getTripById(tripId);
  if (trip.rides?.some(ride => ride.ride.id === rideId)) return;
  let ride = await Ride.getRideById(rideId);
  if (!ride) return;

  Event.createTripRide(tripId, tripCollection, {ride})
})

export const removeCarFromTrip = command('unchecked', async (/** @type {RemoveCarFromTripSchema} */ { tripRideId }) => {
  debug(`addCarToTrip()`)
  Event.deleteTripRide(tripRideId)
})