import Joi from 'joi';
import { command } from '$app/server'
import Rider from '$lib/server/rider';
import createDebugMessages from 'debug';
import Ride from '$lib/server/ride';
import Event from '$lib/server/event';
import Trip from '$lib/server/trip';
import User from '$lib/server/user';
import Vehicle from '$lib/server/vehicle';
const debug = createDebugMessages('APP:lib/server/event')

/**
 * @typedef RideRegistrationFormSchema
 * @prop {string} user
 * @prop {string} event
 * @prop {Partial<Record<'destination_trip' | 'return_trip', string | null>>} rides
 * 
 * @prop {string} jwt
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
 * 
 * @prop {string} jwt
 */
const RideRemoveFormSchema = Joi.object({
  user: Joi.string().pattern(/^[0-9]+$/).required(),
  event: Joi.string().pattern(/^[0-9]+$/).allow(null),
})

/**
 * @typedef AddCarToTripSchema
 * @prop {string} user
 * @prop {string} tripId
 * @prop {string} collection
 * @prop {string} rideId
 * 
 * @prop {string} jwt
 */
/**
 * @typedef RemoveCarFromTripSchema
 * @prop {string} user
 * @prop {string} tripRideId
 * @prop {string} relationshipId
 * @prop {'destination_trip' | 'return_trip'} collection
 * 
 * @prop {string} jwt
 */


export const setRideSelection = command('unchecked', async (/** @type {RideRegistrationFormSchema} */ {event, user, rides, jwt}) => {
  const validatedUser = User.validate(jwt);
  if (!validatedUser) throw new Error('Unauthorized');
  if (validatedUser.id !== user && !validatedUser.is_admin) throw new Error('Cannot modify another user\'s ride selections');

  debug(`setRideSelection(event=${event}, user=${user}, rides=${JSON.stringify(rides)})`)
  /**
   * @type {any[]}
   */
  let r = []
  let eventData = await Event.getEventById(event).catch(console.error);
  if (eventData?.attendees?.some(attendee => attendee.users_id.id === user)) {
    r.push(await Event.removeAttendeeFromEvent(event, user).catch(console.error));
  }
  r.push(await Event.addAttendeeToEvent(event, user).catch(console.error));
  Object.entries(rides).forEach(async ([key, selection]) => {
    let id = eventData?.trips?.filter(trip => trip.collection === key).flatMap(trip => trip.item.rides).flatMap(ride => ride.item.riders).find(rider => rider.item?.id === user)?.id;
    if (id) Rider.removeRiderFromRideById(id).catch(console.error);
    if (selection) {
      r.push(await Rider.addRiderToRide(selection, user).catch(console.error));
    }
  })
  return r
})  

export const updateRideSelections = command('unchecked', async (/** @type {RideRegistrationFormSchema} */ {event, user, rides, jwt}) => {
  const validatedUser = User.validate(jwt);
  if (!validatedUser) throw new Error('Unauthorized');
  if (validatedUser.id !== user && !validatedUser.is_admin) throw new Error('Cannot modify another user\'s ride selections');
  
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
    if (selection && Number(selection) > -1) {
      r.push(await Rider.addRiderToRide(selection, user).catch(console.error));
    }
  })
  return r
})

export const removeFromRide = command('unchecked', async (/** @type {RideRemoveFormSchema} */ {event, user, jwt}) => {
  const validatedUser = User.validate(jwt);
  if (!validatedUser) throw new Error('Unauthorized');
  if (validatedUser.id !== user && !validatedUser.is_admin) throw new Error('Cannot modify another user\'s ride selections');
  
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



export const addCarToTrip = command('unchecked', async (/** @type {AddCarToTripSchema} */ { tripId, collection, rideId, jwt }) => {
  const validatedUser = User.validate(jwt);
  if (!validatedUser) throw new Error('Unauthorized');
  if (!validatedUser.carpool_driver_eligible && !validatedUser.is_admin) throw new Error('User is not eligible to be a carpool driver');
  if ((await Ride.getRideById(rideId)).driver.some(driver => driver.item?.id === validatedUser.id) && !validatedUser.is_admin) throw new Error('Cannot add or remove cars for another user');
  
  try {
    debug(`addCarToTrip(tripId=${tripId}, collection=${collection}, rideId=${rideId})`)
    console.log(`addCarToTrip(tripId=${tripId}, collection=${collection}, rideId=${rideId})`)
    let trip = collection === 'destination_trip' ? await Trip.getDestinationTripById(tripId) : await Trip.getReturnTripById(tripId);
    if (trip.rides?.some(ride => ride.item.ride.id === rideId)) return;
    let ride = await Ride.getRideById(rideId);
    if (!ride) return;

    let result = await Event.createTripRide({ ride: { id: rideId } })
    // console.log('r1', result)
    switch (collection) {
      case 'destination_trip':
        Event.createDestinationTripRide(tripId, result.id)
        break;
      case 'return_trip':
        Event.createReturnTripRide(tripId, result.id)
        break;
    }

    console.log(`Added ride ${rideId} to trip ${tripId} (${collection})`)
  } catch (error) {
    debug(`addCarToTrip(tripId=${tripId}, collection=${collection}, rideId=${rideId}) error: ${error}`)
    console.error(JSON.stringify(error, null, 2))
  }
})

export const removeCarFromTrip = command('unchecked', async (/** @type {RemoveCarFromTripSchema} */ { tripRideId, collection, relationshipId, jwt }) => {
  const validatedUser = User.validate(jwt);
  if (!validatedUser) throw new Error('Unauthorized');
  if (!validatedUser.carpool_driver_eligible && !validatedUser.is_admin) throw new Error('User is not eligible to be a carpool driver');
  if ((await Event.getTripRideById(tripRideId)).ride.driver.some(driver => driver.item?.id === validatedUser.id) && !validatedUser.is_admin) throw new Error('Cannot add or remove cars for another user');
  
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