/** @module models/DirectusUsersModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: directus_users
export const DirectusUsersModelSchema = Joi.object({
  groups: Joi.object().valid("student", "parent", "coach", "mentor", "alum", "exec", "community", "system").allow(null),
})

export default DirectusUsersModelSchema
