/** @module models/RideModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: ride
export const RideModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  status: Joi.string().valid("published", "draft", "archived").max(255).default("draft"),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  driver: Joi.array().items(Joi.any()),
  vehicle_type: Joi.string().valid("Car", "Van", "Shuttle", "Bus", "Plane", "Other Vehicle").max(255).allow(null),
  name: Joi.string().max(255).required().allow(null),
  seats: Joi.number().integer().required().allow(null),
})

export default RideModelSchema
