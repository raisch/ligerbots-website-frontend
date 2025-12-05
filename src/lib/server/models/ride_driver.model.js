/** @module models/RideDriverModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: ride_driver
export const RideDriverModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  ride_id: Joi.number().integer().allow(null),
  item: Joi.string().max(255).allow(null),
  collection: Joi.string().max(255).allow(null),
})

export default RideDriverModelSchema
