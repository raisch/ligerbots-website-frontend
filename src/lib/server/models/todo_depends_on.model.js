/** @module models/TodoDependsOnModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: todo_depends_on
export const TodoDependsOnModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  todo_id: Joi.number().integer().allow(null),
  item: Joi.string().max(255).allow(null),
  collection: Joi.string().max(255).allow(null),
})

export default TodoDependsOnModelSchema
