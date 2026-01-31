import Joi from 'joi';
import { command } from '$app/server'
import Rider from '$lib/server/rider';
import createDebugMessages from 'debug';
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
  /**
   * @type {any[]}
   */
  let r = []
  if (event) {
    r.push(await Rider.removeRiderFromTrip(event, user).catch(console.error));
  } else {
    r.push(await Rider.removeRiderFromAll(user).catch(console.error));
  }
  return r
})
