/** @module models/TripRideRidersModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: trip_ride_riders
export const TripRideRidersModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  trip_ride_id: Joi.number().integer().allow(null),
  item: Joi.string().max(255).allow(null),
  collection: Joi.string().max(255).allow(null),
})

export default TripRideRidersModelSchema
