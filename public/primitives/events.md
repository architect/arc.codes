# Events

Architect can publish JSON payloads to an SNS Topic and subscribe a Lambda an SNS Topic 

### Provision

Events are defined in `.arc` under `@events`:

```arc
@app
testapp

@events
account-signup
account-check-email
```

*Event names are _lowercase alphanumeric_ and can contain _dashes_.* It is reccomended to create a naming convention to group similar events and (ideally) keep them single purpose.

## Event Subscribers

Running `arc init` with the arcfile above will generate the following local source code:

- `/src/events/account-signup`
- `/src/events/account-check-email`

These are event handlers subscribed to the event name defined in `.arc`.

> Events are supported by `arc sandbox`

### Generated AWS Infra

Running `arc deploy` will setup the following AWS resources:

- `AWS::Lambda::Function`
- `AWS::SNS::Topic`

## Publishing Events

All runtime Lambda functions share an IAM Role that allows them to publish events to any SNS Topic in the currently deployed Cloudformation stack. 

### Publish an event payload to an SNS Topic

Node:
```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let name = 'account-signup'
  let payload = {body: req.body}
  await arc.events.publish({name, payload})
  return {statusCode: 201}
}
```

Ruby:
```ruby
```

Python:
```python
```

