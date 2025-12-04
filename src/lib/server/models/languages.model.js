/** @module models/LanguagesModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: languages
export const LanguagesModelSchema = Joi.object({
  code: Joi.string().max(255).required(),
  name: Joi.string().max(255).allow(null),
  direction: Joi.string().valid("ltr", "rtl").max(255).allow(null).default("ltr"),
})

export default LanguagesModelSchema
