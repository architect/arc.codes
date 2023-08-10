---
title: Background tasks
category: Tutorials
description: A tutorial for using functions as background tasks with @events, @scheduled, and @queues
sections:
  - Overview
  - Events example
  - Scheduled example
  - Queues example
---

## Overview

Background tasks are a common workload and perfect for [Functional Web Apps](https://fwa.dev). They reinforce event-driven architecture and allow you to perform asynchronous work across a distributed system. These functions are well suited for processes that don't require an immediate response, or are too resource intensive for a single function.

Architect has three main primitives of background functions:
- [@events](/docs/en/reference/arc-pragmas/@events) - A pub/sub service that uses SNS.
- [@scheduled](/docs/en/reference/arc-pragmas/@scheduled) - CRON functions that are invoked at a specific rate with CloudWatch Events.
- [@queues](/docs/en/reference/arc-pragmas/@queues) - A distributed message queue that uses SQS.

Each type of function enables a reliable way for Lambda functions to call one another while also remaining stateless. This allows your distributed system to process data before it has to be committed to a persistent store. Imagine background tasks as more memory for your main functions to do more work that it doesn't have to deal with right away.

**Sections:**

  - [Overview](#overview)
  - [Events example](#events-example)
  - [Scheduled example](#scheduled-example)
  - [Queues example](#queues-example)

## @events example

`@events` give your application a pub/sub message bus with [AWS Simple Notification Service(SNS)](https://docs.aws.amazon.com/sns/latest/dg/welcome.html).
In this tutorial, we will create an event topic, POST JSON data to invoke a subscribed Lambda function. Any `@event` function subscribed to the named topic will catch the event object, at least once. The event functions are also good for creating a one to many pattern. The same original event object can be sent to any number of functions

1. We will start with a fresh project and install dependencies.

<arc-viewer default-tab=bash>
<div slot=contents>
<arc-tab label=bash>
<h5>Bash/cmd.exe</h5>
<div slot=content>

```bash
npm init @architect arc-event-app
cd arc-event-app
```
</div>
</arc-tab>

<arc-tab label=PowerShell>
<h5>PowerShell</h5>
<div slot=content>

```powershell
npm init "@architect" arc-event-app
cd arc-event-app
```
</div>
</arc-tab>
</div>
</arc-viewer>

2. Open up your `app.arc` file and add the `@event` pragma along with a POST route

```arc
# app.arc

@app
arc-event-app

@http
get /
post /yolo

@events
yolo
```

Run the command `arc init` to scaffold the functions that are declared in the `app.arc` file.

Now we can write our `get-index` handler. This function handler sends an HTML form to the client, and allows them to make a POST request to the `/yolo` endpoint.

```javascript
// src/http/get-index/index.js

  exports.handler = async function http() {

    let form =
    `<form action=/yolo method=post>
      <button>YOLO</button>
    </form>`

    let html = `<!doctype html><html><body>${ form }</body></html>`

    return {
      statusCode: 200,
      headers: { 'content-type': 'text/html' },
      body: html
    }
  }
```

Next we're going to create a new event function in `/src/events/yolo/`. This function is automatically subscribed to the topic created from the `app.arc` file and will receive a JSON payload published to the event name.

```javascript
// src/events/yolo/index.js

let arc = require('@architect/functions')

async function yoloEvent(event) {
  console.log('got event', JSON.stringify(event, null, 2))
  return true
}

exports.handler = arc.events.subscribe(yoloEvent)
```

The final step is creating a POST endpoint for the client to send JSON data. Good thing we can make another Lambda function, and the `@architect/functions` library will handle publishing and service discovery of the SNS topic. Since each function is separated in it's execution, we will have to install it locally and declare a `package.json` in the function folder.

``` bash
cd src/http/post-yolo/
npm init -y
npm install @architect/functions
```

After the library is installed we can now use it for a clean method to interact with the SNS topic. The function accepts a JSON payload with two keys: `name` and `payload`.

``` javascript
// src/http/post-yolo/index.js

let arc = require('@architect/functions')

async function yolo() {
  await arc.events.publish({
    // the name of the event
    name: 'yolo',
    // the JSON payload you want to send
    payload: {
      message: 'swag',
      timestamp: new Date(Date.now()).toISOString()
    }
  })
  return { location: '/' }
}

exports.handler = arc.http(yolo)
```
Test it locally by running `npm start` in your terminal from the project root. Architect's Sandbox environment will emulate the same behavior once your project is deployed. Within the event function, you can split logic among code from `src/shared`.

```bash
cd ../../..
npm start
```
Navigate to `http://localhost:3333` and click the "YOLO" button, watch your terminal for the output. You should see Sandbox output the `@event` object and log the output of your `yolo` event function.

## @scheduled example

Another common background task is `@scheduled` functions. These functions are invoked on a schedule defined in the `app.arc` file. These functions are good for cleanup tasks or kicking off other kinds of health checks. Let's make a new project and add a `@scheduled` function.

The first thing we will need is a fresh Architect project. We can create one directly from the terminal.

<arc-viewer default-tab=bash>
<div slot=contents>
<arc-tab label=bash>
<h5>Bash/cmd.exe</h5>
<div slot=content>

```bash
npm init @architect ./arc-scheduled-app
cd arc-scheduled-app
```
</div>
</arc-tab>

<arc-tab label=PowerShell>
<h5>PowerShell</h5>
<div slot=content>

```powershell
npm init "@architect" ./arc-scheduled-app
cd arc-scheduled-app
```
</div>
</arc-tab>
</div>
</arc-viewer>

Now we can open up the `app.arc` file and add a scheduled function to the manifest.

```arc
# app.arc

# your project namespace
@app
arc-scheduled-app

# http functions and routes
@http
get /

# scheduled functions listed by name and rate
@scheduled
daily rate(1 day)
```

Architect looks for the function named `daily` in the `src/scheduled/daily` folder. So let's go ahead and write one.

```javascript
// src/scheduled/daily/index.js

exports.handler = async function scheduled (event) {
  console.log(JSON.stringify(event, null, 2))
  return
}
```

When this function is deployed, it is registered to an AWS CloudWatch Event. The event will trigger this function to handle the event payload coming into it. It should be treated as something that happens in the background of your main application to handle work on a regular and periodic cycle.

Let's take a look at the generated `sam.yaml` to see how the resource will be created.

From the terminal, run `arc deploy --dry-run` and take a look at `sam.yaml` in the project's root directory.

```yaml
"Daily": {
      "Type": "AWS::Serverless::Function",
      "Properties": {
        "Handler": "index.handler",
        "CodeUri": "./src/scheduled/daily",
        "Runtime": "nodejs14.x",
        "MemorySize": 1152,
        "Timeout": 5,
        "Environment": {
          "Variables": {
            "ARC_ROLE": {
              "Ref": "Role"
            },
            "ARC_CLOUDFORMATION": {
              "Ref": "AWS::StackName"
            },
            "ARC_APP_NAME": "arc-scheduled-app",
            "ARC_HTTP": "aws_proxy",
            "ARC_ENV": "staging",
            "SESSION_TABLE_NAME": "jwe"
          }
        },
        "Role": {
          "Fn::Sub": [
            "arn:aws:iam::${AWS::AccountId}:role/${roleName}",
            {
              "roleName": {
                "Ref": "Role"
              }
            }
          ]
        },
        "Events": {
          "DailyEvent": {
            "Type": "Schedule",
            "Properties": {
              "Schedule": "rate(1 day)"
            }
          }
        }
      }
    },
```

The `Events` property on the `Daily` function shows that this is a scheduled event with a rate of being invoked once a day. The rate expression starts when the rule is created at the time of deployment. If you need more fine grained control over the timing, then you'll have to write a CRON expression. For more information about schedule rules, follow the [AWS documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html).


## @queues example

`@queues` are very similar to `@events` because they also allow for asynchronous message processing. `@queues` will provision an AWS SQS queue and register a lambda function to handle messages that are sent to the queue. There are notable differences between `@queues` and `@events`. While `@events` pushes messages to all of it's subscribers, `@queues` will poll for messages. Queues work on the first message in the queue before moving onto the next. Queues will also keep retrying until it is delivered for up to 4 days.

Let's make an example message queue by starting with a fresh Architect project.

<arc-viewer default-tab=bash>
<div slot=contents>
<arc-tab label=bash>
<h5>Bash/cmd.exe</h5>
<div slot=content>

```bash
npm init @architect ./arc-queues-app
cd arc-queues-app
```
</div>
</arc-tab>

<arc-tab label=PowerShell>
<h5>PowerShell</h5>
<div slot=content>

```powershell
npm init "@architect" ./arc-queues-app
cd arc-queues-app
```
</div>
</arc-tab>
</div>
</arc-viewer>

Open up the `app.arc` file and modify the manifest to include our `@queues` function as follows:

```arc
# app.arc

@app
arc-queues-app

@http
get /

@queues
account-signup
```

When you modify the `app.arc` file, you can run `arc init` from the project root to scaffold the function folders.

The queue function uses SQS as an event source. You can use this pattern to move data between Lambda functions and using the queue as a temporary data store. To write a queue function, make a new file in `src/queues/`

```javascript
// src/queues/account-signup/index.js

exports.handler = async function queue (event) {
  event.Records.forEach(record => {
    const { body } = record;
    console.log(body);
  });
  return {};
}
```

Now we can modify our `get-index` function to publish a message as follows:

```javascript
// src/http/get-index/index.js

let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let name = 'account-signup'
  let payload = {body: req.body, text: 'yolo'}
  await arc.queues.publish({name, payload})
  return {statusCode: 201}
}
```

In order to use `@architect/functions` we need to install it inside the function folder.

```bash
cd src/http/get-index
npm init -y
npm install @architect/functions
cd ../../..
```

Run `npm start` from root of the project to start Sandbox. Navigate to `http://localhost:3333` and take a look in the terminal for our output.

You should see the `@queue` event object being logged in the console of Sandbox.

```json
@queue {
  "name": "account-signup",
  "payload": {
    "body": null,
    "text": "yolo"
  }
}
```

This event has `name` and `payload` keys which are reflected in the records when the queue is polled by the Lambda.
You should also see the output from the `account-signup` function handler:

```json
{"body":null,"text":"yolo"}
```

Let's follow how Architect implements `@queues` by default with CloudFormation. Run `arc deploy --dry-run` and open up `sam.yaml`. You should see that `AccountSignup` has an `Events` event source specified by Type of "SQS":

```yaml
# sam.yaml
"Events": {
  "AccountSignupQueueEvent": {
    "Type": "SQS",
    "Properties": {
      "Queue": {
        "Fn::GetAtt": [
          "AccountSignupQueue",
          "Arn"
        ]
      }
    }
  }
}
```

Architect also creates an SQS Queue with CloudFormation. Notice below that the queue is set to FIFO, instead of standard. Which means this Lambda will try to ensure that it handles all messages in order as they come in batches.

``` yaml
"AccountSignupQueue": {
      "Type": "AWS::SQS::Queue",
      "Properties": {
        "VisibilityTimeout": 5,
        "FifoQueue": true,
        "ContentBasedDeduplication": true
      }
    }
```

The `@architect/functions` [`arc.events`](/docs/en/reference/macros/runtime-helper-reference/arc-events) library has `publish()` and `subscribe()` methods that wrap the JSON payload with a compatible Lambda function signature.
