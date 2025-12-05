/** @module models/PostModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: post
export const PostModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  status: Joi.string().valid("draft", "published", "archived").max(255).required().default("draft"),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  slug: Joi.string().max(255).allow(null),
  title: Joi.string().max(255).required().allow(null),
  body: Joi.string().allow(null),
  thumbnail: Joi.string().uuid().allow(null),
  publish_on: Joi.date().iso().allow(null),
  auto_publish: Joi.boolean().allow(null).default(false),
  lede: Joi.string().allow(null),
  Type: Joi.string().valid("Announcement", "Blog-Post").max(255).allow(null).default("Announcement"),
})

export default PostModelSchema
