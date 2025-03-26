import Joi from 'joi'

/*
 * ===================== !!IMPORTANT!! =====================
 * These schemata MUST be kept up-to-date with the event object
 * definitions in the Directus database.
 *
 * If the database definitions change, these schemata must be
 * updated to match.
 *
 * See https://joi.dev/api/?v=17.13.3 for Joi API documentation.
 */

/*
  Event Schema

    id: number
    name: string
    location: string
    status: string
    description: string
    start_date: date
    end_date: date
    trips: array

  This schema is used to validate the request body when creating or updating an event.
  It is also used to validate the response body when getting a single event.

  The schema is defined using the Joi library, which provides a fluent API for defining
  object schemas and validating objects against those schemas.
*/

export const EventSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
  location: Joi.string().required(),
  status: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  trips: Joi.array().required()
})

/*
 * Event List Schema
 */
export const EventListSchema = Joi.array().items(EventSchema)

/*
 * Event Create Schema
 *
 * Basically, the EventSchema without the id field.
 */
export const EventCreateSchema = EventSchema.keys({
  id: Joi.any().strip()
})
