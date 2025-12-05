/** @module models/EventModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: event
export const EventModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  status: Joi.string().valid("published", "draft", "archived").max(255).default("draft"),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  start_date: Joi.date().iso().allow(null),
  end_date: Joi.date().iso().allow(null),
  name: Joi.string().max(255).required().allow(null),
  location: Joi.string().max(255).required().allow(null),
  trips: Joi.array().items(Joi.any()),
  publish_on: Joi.date().iso().allow(null),
  auto_publish: Joi.boolean().allow(null),
  description: Joi.string().max(1024).allow(null),
})

export default EventModelSchema
