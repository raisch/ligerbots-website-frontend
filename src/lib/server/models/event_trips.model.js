/** @module models/EventTripsModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: event_trips
export const EventTripsModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  event_id: Joi.number().integer().allow(null),
  item: Joi.string().max(255).allow(null),
  collection: Joi.string().max(255).allow(null),
})

export default EventTripsModelSchema
