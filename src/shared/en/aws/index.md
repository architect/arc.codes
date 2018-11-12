# The simplest, most powerful way to build serverless applications

Declaratively define next generation cloud infra with plain text. Build database backed web apps rapidly. Execute long running background tasks (15min), queues, and scheduled jobs. All open source.

⏱  **Deploy in seconds** with first class support for `staging` and `production` envs<br>
💻 **Work locally** while completely offline with a speedy in-memory database<br>
💓 **Primitives, not frameworks**: define app architecture agnostic of vendor arcana<br>
💾 **Version control your architecture** and provision cloud infra in minutes from an `.arc` manifest<br>

Leverage powerful **Amazon Web Services** _serverless_ primitives without frustrating config: 

- [Lambda](https://aws.amazon.com/lambda/) *cloud native* functions for compute 
- [API Gateway](https://aws.amazon.com/api-gateway/) for HTTP
- [Route53](https://aws.amazon.com/route53) for DNS
- [CloudFront](https://aws.amazon.com/cloudfront/) for CDN
- [S3](https://aws.amazon.com/s3/) for static assets
- [Simple Notification Service](https://aws.amazon.com/sns/) for event pub/sub functions
- [Simple Queue Service](https://aws.amazon.com/sqs/) for queue functions
- [CloudWatch Events](https://docs.aws.amazon.com/lambda/latest/dg/with-scheduled-events.html) for scheduled functions
- [DynamoDB](https://aws.amazon.com/dynamodb/) for data persistence, querying and trigger functions
- [Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html) for environment variables

## Install

```bash
npm i @architect/architect
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

`npx create` generates Lambda function code and deploys it:

```bash
/
├── src
│   └── http
│       ├── get-index/
│       ├── get-hellos/
│       └── post-hello/
├── .arc
└── package.json
```

The generated function code in `/src/http/get-index/index.js` looks like this:

```javascript
exports.handler = async function http(request) {
  return {
    type: 'text/html',
    body: '<h1>Hello World! 🎉</h1>'
  }
}```

And `npx deploy` ships iterations on your code to the cloud in seconds. 

---

## Next steps

- [Follow the quickstart](/quickstart)
- [Check out the guides](/guides/offline)
- [Read the reference](/reference)
