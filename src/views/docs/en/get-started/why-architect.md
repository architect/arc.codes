---
title: Why Architect?
category: Get started
description: Why is Architect important to you?
---

> Architect provides everything you need to build massively scalable [Functional Web Apps (FWAs)](https://fwa.dev) with low code, clear and terse config, and zero ceremony


## The best developer experience

Building a functional web app can be fraught with complex vendor arcana and market noise. This is where Architect comes in. Architect is an opinionated developer experience (DX) for building database backed web apps with AWS. We remove all the noise and friction to building FWAs. We prioritize speed with fast local dev, smart configurable defaults and flexible Infrastructure as Code. And then we get out of your way so you can focus on business logic instead of glue code and only pay for services while in use, on-demand, and otherwise _scale to zero_.


### Work locally

Developers need to work locally, to debug, test, and preview code before deploying it. Faster iterations means removing latency in feedback cycles. Architect devs iterate even faster with identical staging and production deployment only seconds away. Other systems require you to figure out these environments and more often than not ad hoc implementations introduce bug vectors due to subtle incompatibilities. Architect treats local development, staging and production as first class concerns.

### Infrastructure as Code

At its heart Architect is an [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) (IaC) framework. Architect defines a high level manifest file, in multiple open text formats, and turns formerly complex cloud infrastructure provisioning into a build artifact. You define the cloud infrastructure your application code requires and check that manifest into version control so infra and code are always aligned and deterministic. Architect compiles manifest code into AWS CloudFormation and deploys it. Architect supports a native text file format `app.arc` in addition to popular formats: `package.json`, `arc.json`, and `arc.yaml`. Teams can choose the dialect that works best for them.

### Secured to least privilege by default

Architect apps are compiled into AWS SAM applications for deployment with CloudFormation. All resources defined in the manifest share one IAM Role with least privilege access to only the resources defined in the same stack. You can modify the generated CloudFormation to change this behavior to lock things down even more or to access AWS resources outside the scope of the current stack.

### Open source and open governance

Architect is part of the OpenJS Foundation and is Apache 2.0 licensed. Architect as an open source project prioritizes regular release cadence and backwards compatibility at all costs.
