/** @module models/AnnouncementModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: announcement
export const AnnouncementModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  status: Joi.string().valid("published", "draft", "archived").max(255).default("draft"),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  title: Joi.string().max(255).required().allow(null),
  body: Joi.string().allow(null),
  lede: Joi.string().allow(null),
  slug: Joi.string().max(255).required().allow(null),
  publish_on: Joi.date().iso().allow(null),
  auto_publish: Joi.boolean().allow(null).default(false),
})

export default AnnouncementModelSchema
