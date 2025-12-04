/** @module models/PostFiles1Model */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: post_files_1
export const PostFiles1ModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  post_id: Joi.number().integer().allow(null),
  directus_files_id: Joi.string().uuid().allow(null),
})

export default PostFiles1ModelSchema
