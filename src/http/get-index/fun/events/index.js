let oldPublish = require('./publish-old')
let publish = require('./publish')
let subscribe = require('./subscribe')

module.exports = {

  /**
   * arc.events.publish
   *
   * publish events (sns topics)
   *
   * @param {Object} params
   * @param {String} params.name - the event name (required)
   * @param {String} params.payload - a json event payload (required)
   * @param {Function} callback - a node style errback (optional)
   * @returns {Promise} - returned if no callback is supplied
   */
  publish(params, callback) {
    if (process.env.ARC_CLOUDFORMATION) {
      return publish(params, callback)
    }
    else {
      return oldPublish(params, callback)
    }
  },

  /**
   * arc.events.subscribe
   *
   * listen for events (sns topics)
   *
   * @param {Function} handler - a single event handler function
   * @returns {Lambda} - a Lambda function sig: (event, context, callback)=>
   */
  subscribe,
}
