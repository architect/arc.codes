# Events

## Run cloud functions in the background

Subscribe a Lambda function to an SNS Topic and then asynchronously publish JSON payloads to it. SNS is a publish-subscribe (pub/sub) system. Messages are immediately pushed to subscribers when they are sent by publishers. 

---

- <a href=#local><b>🚜 Work Locally</b></a> 
- <a href=#provision><b>🌾 Provision</b></a> 
- <a href=#deploy><b>⛵️ Deploy</b></a>
- <a href=#publish><b>💌 Publish</b></a>

---

<h2 id=local>🚜 Work Locally</h2>

Events are defined in `.arc` under `@events`:

```arc
@app
testapp

@events
account-signup
account-check-email
```

*Event names are _lowercase alphanumeric_ and can contain _dashes_.* It is recommended to create a naming convention to group similar events and (ideally) keep them single purpose.

### Event Subscribers

Running `arc init` with the `.arc` file above will generate the following local source code:

- `/src/events/account-signup`
- `/src/events/account-check-email`

These are event handlers subscribed to the event name defined in `.arc`.

> Events are supported by `arc sandbox`

---

<h2 id=provision>🌾 Provision</h2>

Running `arc deploy` will setup the following AWS resources:

- `AWS::Lambda::Function`
- `AWS::SNS::Topic`
- `AWS::Lambda::Permission`

Additionally `AWS::SSM::Parameter` resources are created for every SNS Topic which can be inspected at runtime:

- **`/[StackName]/events/[EventName]`** with a value of the generated SNS Topic ARN

> All runtime functions have the environment variable `AWS_CLOUDFORMATION` which is the currently deployed CloudFormation stack name; this combined w the runtime `aws-sdk` or `@architect/functions` can be used to lookup these values in SSM

--- 

<h2 id=deploy>⛵️ Deploy</h2>

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy dirty` to overwrite deployed staging lambda functions 
- `arc deploy production` to run a full CloudFormation production deployment

---

<h2 id=publish>💌 Publish</h2>

All runtime Lambda functions share an IAM Role that allows them to publish events to any SNS Topic in the currently deployed CloudFormation stack. 

### Publish an event payload to an SNS Topic

<section class="code-examples">

Node

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let name = 'account-signup'
  let payload = {body: req.body}
  await arc.events.publish({name, payload})
  return {statusCode: 201}
}
```

Ruby

```ruby
require 'architect-functions'

def handler
  Arc::Events.publish name: 'account-signup', payload: {ok:true}
  {statusCode: 201}
end
```

Python

```python
import arc.events

def handler(request, context):
  arc.events.publish(name='account-signup', payload={'ok':True})
  return {'statusCode': 201}
```

</section>

---
