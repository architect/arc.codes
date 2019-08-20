// Create a combined function from the middleware steps provided
// Each step is a regular Arc 4 async/await route function, that may return
//  - A falsy value - keep processing, ie move onto the next step
//  - A modified request - keep processing, passing the modified request onto subsequent steps
//  - A response - end processing and respond to the client
function addMiddleware(...steps) {
  let combined = async function(request) {
    // Running combined function!
    var response
    for (let step of steps) {
      // Running step ${step.name}
      var middleWareResult = await step(request)
      var isRequest = middleWareResult && middleWareResult.hasOwnProperty('method')
      if (isRequest) {
        // Middleware ${step.name} has returned a modified request, continuing...
        request = middleWareResult
      } else {
        if (middleWareResult) {
          response = middleWareResult
          // Got a response from ${step.name}, finishing...
          break
        }
        // Did not get a result from ${step.name}, continuing...
      }
    }
    // Finished combined function!
    if (!response) {
      throw new Error(`Finished all middleware steps without returning a response.`)
    }
    return response
  }
  return combined
}

module.exports = addMiddleware
