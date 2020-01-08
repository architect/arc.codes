# Architect's Benefits & Differentiators

## Speed - Tools to Help You Write Less Code
You can now develop applications faster with less cloud infra configuration, shorten the feedback loop with local testing, and keep writing in your project's language. Architect's manifest file uses a parser to create AWS CloudFormation to save you from typing hundreds of line of boilerplate and permissions. Architect also comes with a local sandbox built in to let you build and test your application without having to push your code to the cloud first. 

## Security - Safely Deploy and Test Your Code

Security in the cloud is also important, Architect structures its projects to help minimize security risks. Architect adopts best practices for optimizing your code to be ready for production. 

Functions are provisioned and deployed with least priveledges. This follows the [Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/) in the cloud. For example, an http function will be created with the most minimal IAM role to execute. This opt-in model of permissions prevents your functions from having over reaching authorization.

## Developer Experience - Cloud Native Framework

Architect aims to give a developer really simple building blocks that represent cloud native services to create the most productive and modern web architectures. These building blocks are known as application primitives, and are comprised of the following AWS Services: 
- [CloudFormation](https://aws.amazon.com/cloudformation/) and [SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-reference.html#serverless-sam-cli) for AWS standard deployments
- [Lambda](https://aws.amazon.com/lambda/) *cloud native* functions for compute
- [API Gateway](https://aws.amazon.com/api-gateway/) for HTTP and Websocket functions
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

Primitives are important - composable pieces of the framework 

## Tradeoffs in Your Application Architecture

Limits of using lambda functions  

Core set of AWS Services supported by Architect out of the box, can be extended with Macros and valid CloudFormation. Take a look at an example Macro that extends the arc file. 

Architect uses primitives in the .arc file to generate the CloudFormation templates necessary to deploy your code onto AWS. **[Link to CF Playground]** 

Learn about App Primitives and Framework decisions

EXTERNAL REFERENCE - GOOD WORDS HERE [https://medium.com/@dm03514/devops-architecture-platform-primitives-frameworks-b8f5a7ab7ff5](https://medium.com/@dm03514/devops-architecture-platform-primitives-frameworks-b8f5a7ab7ff5)

## Differentiators
Open Source 
Open Parser 
Local Testing 
Portable
