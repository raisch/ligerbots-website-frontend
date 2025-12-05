/** @module models/DestinationTripRidesModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: destination_trip_rides
export const DestinationTripRidesModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  destination_trip_id: Joi.number().integer().allow(null),
  item: Joi.string().max(255).allow(null),
  collection: Joi.string().max(255).allow(null),
  ride: Joi.number().integer().allow(null),
})

export default DestinationTripRidesModelSchema
