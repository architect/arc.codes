# Less But Better

<b>Focus on <i>your</i> code.</b> Declaratively define next generation cloud infra with plain text. Build database backed web apps rapidly that scale to zero. Execute long running background tasks (15min) and scheduled jobs. <i>Everything you need to build a modern cloud app with none of the ceremony.</i>

⏱  **Deploy in seconds** with first class support for `staging` and `production` envs<br>
💻 **Work locally** while completely offline with a speedy in-memory database<br>
💓 **Primitives, not frameworks**: define app architecture agnostic of vendor arcana<br>
💾 **Version control your architecture** and provision cloud infra in minutes from an `.arc` manifest <br>

Deploy powerful **Amazon Web Services** _serverless_ primitives with clear and readable config: 

- [CloudFormation](https://aws.amazon.com/cloudformation/) and [SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-reference.html#serverless-sam-cli) for AWS standard deployments
- [Lambda](https://aws.amazon.com/lambda/) *cloud native* functions for compute 
- [API Gateway](https://aws.amazon.com/api-gateway/) for HTTP and Websocket functions
- [Route53](https://aws.amazon.com/route53) for DNS and [CloudFront](https://aws.amazon.com/cloudfront/) for CDN
- [S3](https://aws.amazon.com/s3/) for static assets
- [Simple Notification Service](https://aws.amazon.com/sns/) for event pub/sub functions
- [Simple Queue Service](https://aws.amazon.com/sqs/) for queue functions
- [CloudWatch Events](https://docs.aws.amazon.com/lambda/latest/dg/with-scheduled-events.html) for scheduled functions
- [DynamoDB](https://aws.amazon.com/dynamodb/) for data persistence, querying and trigger functions
- [Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html) for service discovery and environment variables
- [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege) automatically generated least privilege role

## Install

```bash
npm install -g @architect/cli
```

Everything starts with an `.arc` file:

```arc
# this is an .arc file
@app
testapp

@http
get /
get /hellos
post /hello
```

`arc init` generates local function code:

```bash
/
├── src
│   └── http
│       ├── get-index/
│       ├── get-hellos/
│       └── post-hello/
└── .arc
```

The generated code in `/src/http/get-index/index.js` looks like this:

```javascript
exports.handler = async function http(request) {
  return {
    type: 'text/html',
    body: '<h1>Hello World! 🎉</h1>'
  }
} 
```

And `arc deploy` ships iterations on your code to the cloud. 

---

## Next steps

- [Follow the quickstart](/quickstart)
- [Check out the guides](/guides/http)
