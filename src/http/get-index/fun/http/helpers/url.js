/**
 * no magic url helper
 *
 * given a path / returns
 *
 * - / if NODE_ENV === testing
 * - /staging if NODE_ENV === staging
 * - /production if NODE_ENV === production
 */
module.exports = function url(url) {
  let staging = process.env.NODE_ENV === 'staging'
  let production = process.env.NODE_ENV === 'production'
  if (staging || production)
    return `/${process.env.NODE_ENV}${url}`
  return url // fallthru for NODE_ENV=testing
}
