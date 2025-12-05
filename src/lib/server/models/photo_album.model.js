/** @module models/PhotoAlbumModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: photo_album
export const PhotoAlbumModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  status: Joi.string().valid("published", "draft", "archived").max(255).default("draft"),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
})

export default PhotoAlbumModelSchema
