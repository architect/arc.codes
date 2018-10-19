# Upgrade Guide

> Guides for upgrading to the latest version of `.arc`

## 4.x

Deprecated Docs
  - [Roadmap](/intro/roadmap)

  - [`@css`](/reference/css)
  - [`@html`](/reference/html)
  - [`@js`](/reference/js)
  - [`@json`](/reference/json)
  - [`@text`](/reference/text)
  - [`@xml`](/reference/xml)

  - [`arc.html.get`](/reference/html-get)
  - [`arc.html.post`](/reference/html-post)
  - [`arc.css.get`](/reference/css-get)
  - [`arc.js.get`](/reference/js-get)
  - [`arc.text.get`](/reference/text-get)
  - [`arc.json.get`](/reference/json-get)
  - [`arc.json.post`](/reference/json-post)
  - [`arc.json.put`](/reference/json-put)
  - [`arc.json.patch`](/reference/json-patch)
  - [`arc.json.delete`](/reference/json-delete)
  - [`arc.xml.get`](/reference/xml-get)
  - [`arc.xml.post`](/reference/xml-post)
  - [`arc.xml.put`](/reference/xml-put)
  - [`arc.xml.patch`](/reference/xml-patch)
  - [`arc.xml.delete`](/reference/xml-delete)

## 3.3.0

`@architect/workflows` added SQS support in `3.3.0` and existing apps will need to add permissions to the default `arc-role` IAM Role used for Lambda execution if they want to add `@queues`.

**Using the AWS Console**

1. Open up IAM in the AWS Console
2. Select **Roles** &rarr; **arc-role**
3. Click **Attach Policies**
4. Select **AWSLambdaSQSQueueExecutionRole**
5. Click **Attach Policy**

Now existing functions can publish to SQS queues.

**With the AWS CLI**

If the command line is more your style you can upgrade with the following:

```bash
aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole --role-name arc-role
```

**With NodeJS**

If you prefer to script this upgrade you can use the NodeJS `aws-sdk`:

```javascript
let aws = require('aws-sdk')
let PolicyArn = 'arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole'

let iam = new aws.IAM
iam.attachRolePolicy({
  RoleName: 'arc-role'
  PolicyArn, 
}, console.log)
```
