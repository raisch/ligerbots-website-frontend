/** @module models/ReturnTripModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: return_trip
export const ReturnTripModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  status: Joi.string().valid("published", "draft", "archived").max(255).default("draft"),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  destination: Joi.string().max(255).allow(null),
  departs_from: Joi.string().max(255).allow(null),
  departs_on: Joi.date().iso().allow(null),
  departs_at: Joi.any().allow(null),
  rides: Joi.array().items(Joi.any()),
  arrives_at: Joi.any().allow(null),
})

export default ReturnTripModelSchema
