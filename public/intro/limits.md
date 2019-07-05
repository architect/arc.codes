# Limits &amp; Superpowers

The cloud has its limits. And `arc` itself is an abstraction with deliberate constraints. Whether we label them *constraints* or *limits*, they are **trade-offs** you need to be aware of when designing your software architecture for cloud functions.

---

## Supported Services

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

---

## Cloud limits and gotchas

- Lambda cold starts are vicious on large Lambdas; the best antidote is to author small as possible Lambda functions (rule of thumb: sub 5MB compressed, including modules, usually results in sub-second execution)
- Lambda functions are time-limited to 5 seconds [by default](/reference/arc-config). This can be [adjusted](/reference/arc-config), however they cannot execute for longer than 15 minutes maximum. You can also use [background tasks](/guides/background-tasks) to break work down into smaller chunks. 
- CloudFormation templates can only have 200 resources; Architect can nest templates but API Gateway can only support 300 routes and many other limits can apply

---

## Cloud Superpowers

- Less code is faster to write and deploy
- Determinism that comes as a result of infra as code deployments 
- Extend with the entire AWS ecosystem of services and tools
- Predictable costs and 100% utilization (scale to zero)
- Do less of everything: patching, no upgrading, no more orchestration 
- Faster debugging because errors became very shallow in isolation
- Better isolation also equals better security posture and least privilege by default

Focus on unique business value, only maintain differentiated code and iterate faster with tighter feedback loops.

---

## Next: [Check out the quickstart](/quickstart)

---
