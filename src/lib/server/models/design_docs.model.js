/** @module models/DesignDocsModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: design_docs
export const DesignDocsModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  title: Joi.string().max(255).required().allow(null),
  content: Joi.object().allow(null),
  project: Joi.string().valid("carpool").max(255).allow(null),
})

export default DesignDocsModelSchema
