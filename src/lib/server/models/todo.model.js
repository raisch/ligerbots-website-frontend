/** @module models/TodoModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: todo
export const TodoModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  status: Joi.string().valid("not_started", "in_progress", "completed", "archived").max(255).required().default("not_started"),
  user_created: Joi.string().uuid().allow(null),
  date_created: Joi.date().iso().allow(null),
  user_updated: Joi.string().uuid().allow(null),
  date_updated: Joi.date().iso().allow(null),
  title: Joi.string().max(255).required().allow(null),
  due_date: Joi.date().iso().allow(null),
  notes: Joi.string().allow(null),
  depends_on: Joi.array().items(Joi.any()),
  category: Joi.string().valid("api", "front_end", "back_end", "Script", "deploy", "other").max(255).allow(null),
  actor: Joi.number().integer().allow(null),
})

export default TodoModelSchema
