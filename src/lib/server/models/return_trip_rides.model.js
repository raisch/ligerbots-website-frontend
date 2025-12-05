/** @module models/ReturnTripRidesModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: return_trip_rides
export const ReturnTripRidesModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  return_trip_id: Joi.number().integer().allow(null),
  item: Joi.string().max(255).allow(null),
  collection: Joi.string().max(255).allow(null),
  ride: Joi.number().integer().allow(null),
})

export default ReturnTripRidesModelSchema
