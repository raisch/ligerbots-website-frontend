/**
 * Local utility functions.
 *
 * @module lib/util
 */

/**
 * Format date string to human-readable format: 'January 1, 2024'.
 *
 * @param {string|Date} date
 * @returns {string}
 */
export function prettyDate(date) {
  date = date instanceof Date ? date : new Date(date)
  return date.toLocaleDateString('en-US', {
    // weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Given a date string or Date object, return a formatted date string as YYYY-MM-DD.
 *
 * @param {string|Date} date
 * @param {string} [locale='en-US']
 * @returns string | null
 *
 * @throws {Error} If date is not a string or Date object
 */
export function formatDate(date, locale = 'en-US') {
  /**
   * Given a string, return a string with a leading zero if the string is a single digit.
   *
   * @param {string} str
   * @returns string
   */
  const addZero = (str) => (str && typeof str === 'string' && str.length === 1 ? '0' + str : str)

  if (typeof date === 'string') {
    date = new Date(date)
  }
  if (date instanceof Date === false) {
    throw new Error('requires a date string or Date object')
  }
  const [mon, day, year] = date
    .toLocaleDateString(locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
    .split('/')
  return year + '-' + addZero(mon) + '-' + addZero(day)
}

/**
 * Given a string, return a slugified version of the string.
 *
 * @param {string} str
 * @returns string
 *
 * @throws {Error} If str is not a string
 */
export function slugify(str) {
  if (typeof str !== 'string') {
    throw new Error('requires a string')
  }
  str = str.replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
  str = str.toLowerCase() // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
  return str
}

/**
 * Given an object, return a stringified version of the object,
 * safe from cycles.
 *
 * @param {any} obj
 * @returns {string}
 */
export function stringify(obj, replacer = null, space = 2) {
  /** @type {any[]} */
  let cache = []
  let str = JSON.stringify(
    obj,
    replacer ||
      function (key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return
          }
          // Store value in our collection
          cache.push(value)
        }
        return value
      },
    space
  )
  cache = [] // Allow garbage collection
  return str
}
