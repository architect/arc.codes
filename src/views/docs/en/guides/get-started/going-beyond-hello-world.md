---
title: Going beyond "Hello World"
description: Architect Primitives
sections:
  - Static assets & CDNs
  - Database tables
  - Environment variables
  - CI / CD
  - Event functions
  - Scheduled Functions
  - Queue functions
  - Macros
---

## Static assets & CDNs

### Static assets

Architect projects support text and binary assets such as images, styles, and scripts. These assets are available directly from the root of your app on the same domain as HTTP functions. They are available to you by provisioning your own S3 bucket with the `@static` pragma and sending requests to Amazon S3 using the REST API. 

**`@static` will define S3 buckets for hosting static assets, uploaded from the `public/` folder**. 

The `@static` pragma utilizes [**Amazon Simple Storage Service (Amazon S3)**](https://aws.amazon.com/s3/). Amazon S3 is an object storage service that offers industry-leading scalability, data availability, security, and performance. It is the original serverless primitive. 

> 💡 Learn more about [Static assets](/en/reference/static-assets/static) here.

### CDNs

Architect projects support the ability to add a content delivery network (CDN) with AWS CloudFront. **[Amazon CloudFront](https://aws.amazon.com/cloudfront/)** is a mature and powerful content delivery network that speeds up distribution of your static and dynamic web content, such as .html, .css, .js, and image files, to your users. CloudFront delivers your content through a worldwide network of data centers called edge locations. When a user requests content that you're serving with CloudFront, the user is routed to the edge location that provides the lowest latency (time delay), so that content is delivered with the best possible performance.

> 💡 Learn more about [CDNs](/en/reference/static-assets/cdn) here.

## Database tables

Architect comes built in with first-class, easy to use, **[DynamoDB](https://aws.amazon.com/dynamodb/)** support and the ability to add databases we call "tables". `@tables` defines DynamoDB database tables and trigger functions for them. 

> 💡 Learn more about [Tables](/en/reference/databases/tables) here.

## Environment variables

Read and write environment variables. Sensitive configuration data, such as API keys, needs to happen outside of the codebase in revision control and you can use this tool to ensure an entire team and the deployment targets are in sync.

> 💡 Learn more about [.env](/en/reference/cli-reference/env) here.

## CI / CD

ADD ME!


## Event functions

Subscribe a Lambda function to an SNS Topic and then asynchronously publish JSON payloads to it. [Amazon Simple Notification Service (SNS)](https://aws.amazon.com/sns/) is a publish-subscribe (pub/sub) system. Messages are immediately pushed to subscribers when they are sent by publishers. The `@events` pragma is super useful for running cloud functions in the background.

> 💡 Learn more about [Event functions](/en/reference/functions/event-functions) here.

## Scheduled Functions

Scheduled Functions creates stateless functions that run on a schedule. You can create rules that self-trigger on an automated schedule in your app using `cron` or `rate` expressions. The `@scheduled` pragma utilizes Amazon [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) to give Architect this scheduling functionality.

> 💡 Learn more about [Scheduled Functions](/en/reference/functions/scheduled-functions) here.

## Queue functions

Queue functions subscribe a Lambda function to an [SQS Queue](https://aws.amazon.com/sqs/) and then asynchronously publish JSON payloads to it. Amazon SQS automatically polls to receive messages. This programming model is identical to SNS but offers different service guarantees and configuration options. In particular, SNS will retry failed invocations twice whereas SQS will retry for 4 days (by default).


## Macros

The `@macro` pragma helps you to extend `app.arc` with standard [CloudFormation](https://aws.amazon.com/cloudformation/). Macros allow devs to add any resources or modify existing ones extending Architect into the entire AWS ecosystem supported by CloudFormation.

> Note: with [Architect Macros](/en/reference/macros) all AWS services supported by CloudFormation can be utilized!



