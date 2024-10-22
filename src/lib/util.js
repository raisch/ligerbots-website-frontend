/**
 * Format date string to human-readable format.
 *
 * @param {String} str
 * @returns {String}
 */
export function prettyDate(str) {
  const date = new Date(str)
  return date.toLocaleDateString('en-US', {
    // weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
