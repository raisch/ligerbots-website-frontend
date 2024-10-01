import { isDirectusClient, getBackendClient } from '../../../lib/backend.js'

/** @type {ExportedFunctions} */
export { isDirectusClient, getBackendClient }

/**
 * @typedef {Object} ExportedFunctions
 *
 * @property {boolean} isDirectusClient
 * @property {Promise<import('../../../lib/backend.js').DirectusClient>} getBackendClient
 */
