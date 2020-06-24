# Queues
## Run cloud functions in the background

Subscribe a Lambda function to an SQS Queue and then asynchronously publish JSON payloads to it. SQS automatically polls to receive messages. The programming model is identical to SNS but offers different service guarantees and configuration options. In particular, SNS will retry failed invocations twice whereas SQS will retry for 4 days (by default).

> Read the official [AWS docs on Lambda retry behavior](https://docs.aws.amazon.com/lambda/latest/dg/retries-on-errors.html)

---

- <a href=#local><b>🚜 Work Locally</b></a>
- <a href=#provision><b>🌾 Provision</b></a>
- <a href=#deploy><b>⛵️ Deploy</b></a>
- <a href=#publish><b>💌 Publish</b></a>

---

<h2 id=local>🚜 Work Locally</h2>

Events are defined in `app.arc` under `@queues`:

```arc
@app
testapp

@queues
system-backup
repo-close-stale-issues
```

*Queue names are _lowercase alphanumeric_ and can contain _dashes_.* It is recommended to create a naming convention to group similar events and (ideally) keep them single purpose.

### Queue Subscribers

Running `arc init` with the `app.arc` file above will generate the following local source code:

- `/src/queues/system-backup`
- `/src/queues/repo-close-stale-issues`

These are queue handlers subscribed to the queue name defined in `app.arc`.

> Queues are supported by `arc sandbox`

---

<h2 id=provision>🌾 Provision</h2>

Running `arc deploy` will setup the following AWS resources:

- `AWS::Lambda::Function`
- `AWS::SQS::Queue`
- `AWS::Lambda::EventSourceMapping`

Additionally `AWS::SSM::Parameter` resources are created for every SQS Queue which can be inspected at runtime:

- **`/[StackName]/events/[QueueName]`** with a value of the generated SQS Queue URL

> All runtime functions have the environment variable `AWS_CLOUDFORMATION` which is the currently deployed CloudFormation stack name; this combined w the runtime `aws-sdk` or `@architect/functions` can be used to lookup these values in SSM

---

<h2 id=deploy>⛵️ Deploy</h2>

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy dirty` to overwrite deployed staging lambda functions
- `arc deploy production` to run a full CloudFormation production deployment

---

<h2 id=publish>💌 Publish</h2>

All runtime Lambda functions share an IAM Role that allows them to publish events to any SQS Queue in the currently deployed CloudFormation stack.

### Publish an event payload to an SQS Queue URL

<section class="code-examples">

Node

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let name = 'account-signup'
  let payload = {body: req.body}
  await arc.queues.publish({name, payload})
  return {statusCode: 201}
}
```

Ruby

```ruby
require 'architect-functions'

def handler
  Arc::Queues.publish name: 'account-signup', payload: {ok:true}
  {statusCode: 201}
end
```

Python

```python
import arc.queues

def handler(request, context):
  arc.queues.publish(name='account-signup', payload={'ok':True})
  return {'statusCode': 201}
```

</section>

---
