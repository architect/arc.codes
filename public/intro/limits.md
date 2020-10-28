# Limits &amp; superpowers

The cloud has its limits. And `arc` itself is an abstraction with deliberate constraints. Whether we label them *constraints* or *limits*, they are **trade-offs** you need to be aware of when designing your software architecture for cloud functions.

---

## Supported services

Architect primitives are based on the following AWS serverless ecosystem services:

- [CloudFormation](https://aws.amazon.com/cloudformation/) and [SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-reference.html#serverless-sam-cli) for AWS standard deployments
- [Lambda](https://aws.amazon.com/lambda/) *cloud native* functions for compute
- [API Gateway](https://aws.amazon.com/api-gateway/) for HTTP and WebSocket functions
- [Route53](https://aws.amazon.com/route53) for DNS
- [CloudFront](https://aws.amazon.com/cloudfront/) for CDN
- [S3](https://aws.amazon.com/s3/) for static assets
- [Simple Notification Service](https://aws.amazon.com/sns/) for event pub/sub functions
- [Simple Queue Service](https://aws.amazon.com/sqs/) for queue functions
- [CloudWatch Events](https://docs.aws.amazon.com/lambda/latest/dg/with-scheduled-events.html) for scheduled functions
- [DynamoDB](https://aws.amazon.com/dynamodb/) for persistence of structured data and trigger functions
- [Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html) for service discovery and environment variables
- [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege) automatically generated least privilege role

> **Note:** with [Architect Macros](/primitives/macros) all AWS services supported by CloudFormation can be utilized!

---

## Cloud limits and gotchas

- Cold starts happen to large Lambdas; the solution is small as possible function payloads (rule of thumb: sub 5MB compressed, including modules, will always result in sub-second execution)
- Lambda functions are time-limited to 5 seconds [by default](/reference/arc-config/aws). This can be [adjusted](/reference/arc-config/aws), however they cannot execute for longer than 15 minutes maximum. You can also use events and queues as background tasks to break work down into smaller chunks.
- CloudFormation templates can only have 500 resources

…and many other limits can apply! When in doubt refer to the [official AWS documentation](https://docs.aws.amazon.com) for all limits and quotas; remember you can often request increases through support also! 

---

## Cloud superpowers

- Less code is faster to write and deploy
- Determinism that comes as a result of infra as code deployments
- Extend with the entire AWS ecosystem of services and tools
- Predictable costs and 100% utilization (scale to zero)
- Do less of everything: patching, no upgrading, no more orchestration
- Faster debugging because errors became very shallow in isolation
- Better isolation also equals better security posture and least privilege by default

Focus on unique business value, only maintain differentiated code and iterate faster with tighter feedback loops.

---

> Next steps
> - [Play in the playground](/playground)
> - [Follow the quickstart](/quickstart)
> - [HTTP Functions](/primitives/http)
---
