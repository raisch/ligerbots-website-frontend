import Joi from 'joi';
import { command } from '$app/server'
import Rider from '$lib/server/rider';

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
 * @prop {Array<'destination_trip' | 'return_trip'>?} rides
 */
const RideRemoveFormSchema = Joi.object({
  user: Joi.string().pattern(/^[0-9]+$/).required(),
  event: Joi.string().pattern(/^[0-9]+$/).allow(null),
  rides: Joi.array().items(Joi.valid("destination_trip", "return_trip")).required().allow(null),
})

export const updateRideSelections = command('unchecked', async (/** @type {RideRegistrationFormSchema} */ {event, user, rides}) => {
  Object.entries(rides).forEach(async ([, selection]) => {
    if (selection) {
      await Rider.addRiderToRide(selection, user)
    } else {
      Rider.removeRiderFromTrip(event, user);
    }
  })
})

export const removeFromRide = command('unchecked', async (/** @type {RideRemoveFormSchema} */ {user, event, rides}) => {
  if (event) {
    if (rides) {
      rides.forEach(async type => {
        
      })
    }
  } else {
    Rider.removeRiderFromAll(user);
  }
})