/** @module models/TripRideModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: trip_ride
export const TripRideModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  ride: Joi.number().integer().allow(null),
  riders: Joi.array().items(Joi.any()),
})

export default TripRideModelSchema
