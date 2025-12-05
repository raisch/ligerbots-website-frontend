/** @module models/GlobalModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: global
export const GlobalModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  title: Joi.string().max(255).allow(null),
  description: Joi.string().allow(null),
  restart_secret: Joi.any().allow(null),
  refresh_secret: Joi.any().allow(null),
  site_configuration: Joi.any(),
  navbar: Joi.any(),
  navbar_config: Joi.object().allow(null),
  api_secrets: Joi.any(),
  host: Joi.string().max(255).allow(null).default("http://localhost:4000"),
  frontend_service: Joi.any(),
  mode_change_secret: Joi.any().allow(null),
  maintenance_page_body: Joi.string().max(255).allow(null),
  maintenance_page: Joi.any(),
  maintenance_page_title: Joi.string().max(255).allow(null),
  service_mode: Joi.string().valid("production", "maintenance").max(255).allow(null),
  mode: Joi.any(),
  version: Joi.string().max(255).allow(null).default("1.0"),
  link_to_home_page: Joi.string().max(255).allow(null),
  organization_name: Joi.string().max(255).allow(null).default("ORG NAME"),
})

export default GlobalModelSchema
