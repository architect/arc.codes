# Background Tasks

## Offloading items into smaller tasks for offline completion

To ensure your user-facing lambas complete within limits, you can offload background tasks to other lambdas. `.arc` supports both `@events` and `@queues`

SNS [`@events`](/reference/events) is a distributed publish-subscribe (pub/sub) system. Messages are immediately pushed to subscribers when they are sent by publishers. This is typically called a 'message bus'.

SQS [`@queues`](/reference/queues) is distributed queuing system. Messages are NOT pushed to receivers. Receivers have to poll SQS to receive messages.

In the example below, we'll make a pub/sub system using `@events` and `arc.events.publish`.

Check the [example on GitHub](https://github.com/arc-repos/arc-example-events-pubsub) for a full version of the code described below.

## Creating an SNS message bus

In your `.arc` file, we're going to create a SNS message bus called `background-task`:

```
@events
    background-task 
```

## Subscribing to the queue

In `src/events/background-task/index.js` we'll subscribe to the queue:

```javascript
let arc = require('@architect/functions')
let data = require('@architect/data')
let series = require('run-series')

// I copy paste this from MDN about once a week
function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function handler(record, callback) {
  record.taskID = new Date(Date.now()).toISOString()
  record.status = 'received'
  // got a task!
  series([
    function save(callback) {
      // save the record to the db
      data.tasks.put(record, callback) 
    },
    function progress(callback) {
      // after update the status to 'almost done' after 10-30 seconds
      let timeout = random(3*1000, 10*1000)
      setTimeout(function _delay() {
        record.status = 'processing'
        data.tasks.put(record, callback) 
      }, timeout) 
    },
    function done(callback) {
      // update the status to 'done' after an additional 10-30 seconds
      let timeout = random(10*1000, 20*1000)
      setTimeout(function _delay() {
        record.status = 'complete'
        data.tasks.put(record, callback) 
      }, timeout) 
    }
  ], callback)
}
exports.handler = arc.events.subscribe(handler)

```

## Sending messages to the queue

When we receive a POST message from the client (in `/src/http/post-background`), we'll send it to the queue:

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

exports.handler = async function http(req) {
    await arc.events.publish({
        name: 'background-task',
        payload: {
            background: req.body.background
        }
    })
    return {
        status: 302,
        location: url('/')
    }
}

```

When a user POSTs to `/background` we'll respond immediately, but we'll also publish the payload into the `background-task` message bus, for processing by the subscriber in  `src/events/background-task`.

---

See [the events reference](/reference/events) for more details.

## Next: [Logging & Monitoring](/guides/logging)
