/** @module models/TodoUsersModel */
import Joi from 'joi'

// Auto-generated from schema.yaml for collection: todo_users
export const TodoUsersModelSchema = Joi.object({
  id: Joi.number().integer().positive().required().allow(null),
  todo_id: Joi.number().integer().allow(null),
  users_id: Joi.number().integer().allow(null),
})

export default TodoUsersModelSchema
