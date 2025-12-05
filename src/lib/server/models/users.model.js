/** @module models/UsersModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: users
export const UsersModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  status: Joi.string().valid("published", "draft", "archived").max(255).default("draft"),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  firstname: Joi.string().max(255).required().allow(null),
  lastname: Joi.string().max(255).required().allow(null),
  email_address: Joi.string().max(255).required().allow(null),
  groups: Joi.object().valid("Student", "Parent", "Coach", "Mentor", "Exec", "Alum", "Community", "Other").required().allow(null),
  school: Joi.string().valid("North", "South", "Other").max(255).allow(null),
  graduation_year: Joi.string().max(255).allow(null),
  phone_number: Joi.string().max(255).allow(null),
  parents_email_address: Joi.string().max(255).allow(null),
  emergency_phone_number: Joi.string().max(255).allow(null),
  children: Joi.string().max(255).allow(null),
  address: Joi.string().max(255).allow(null),
  city: Joi.string().max(255).allow(null),
  state: Joi.string().max(255).allow(null),
  zipcode: Joi.string().max(255).allow(null),
  photo: Joi.string().uuid().allow(null),
  password: Joi.any().required().allow(null),
  notes: Joi.string().allow(null),
  parent_names: Joi.string().max(255).allow(null),
  fullname: Joi.string().max(255).allow(null),
  slug: Joi.string().max(255).allow(null),
  last_login: Joi.string().max(255).allow(null),
  is_admin: Joi.boolean().allow(null).default(false),
})

export default UsersModelSchema
