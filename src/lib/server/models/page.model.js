/** @module models/PageModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: page
export const PageModelSchema = Joi.object({
  slug: Joi.string().max(255).required(),
  status: Joi.string().valid("published", "draft", "archived").max(255).default("draft"),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  title: Joi.string().max(255).allow(null),
  subtitle: Joi.string().max(255).allow(null),
  content: Joi.string().allow(null),
  publish_on: Joi.date().iso().allow(null),
  auto_publish: Joi.boolean().allow(null),
  script: Joi.string().allow(null),
  style: Joi.string().allow(null),
})

export default PageModelSchema
