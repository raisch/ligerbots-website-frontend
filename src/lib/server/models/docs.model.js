/** @module models/DocsModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: docs
export const DocsModelSchema = Joi.object({
  slug: Joi.string().max(255).required(),
  status: Joi.string().valid("published", "draft", "archived").max(255).default("draft"),
  sort: Joi.number().integer().allow(null),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  title: Joi.string().max(255).allow(null),
  body: Joi.string().allow(null),
  icon: Joi.string().max(255).allow(null),
  color: Joi.string().max(255).allow(null),
  banner: Joi.string().uuid().allow(null),
  indent_level: Joi.number().integer().allow(null).default(1),
})

export default DocsModelSchema
