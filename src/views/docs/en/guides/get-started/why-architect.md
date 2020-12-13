---
title: Why Architect?
category: Get started
description: Why is Architect important to you?
---

> Architect is the simplest and fastest way to build database backed web apps with AWS SAM

Architect provides everything you need out of the box to build massively scalable serverless apps with low code, clear and terse config, and zero ceremony.

## The best developer experience

Going serverless is fraught with complex vendor arcana and market noise. This is where Architect comes in. We remove all the noise and friction to building serverlessly. We prioritize speed with fast local dev, smart configurable defaults and flexible Infrastructure as Code. And then we get out of your way so you can focus on your code.

Architect is an opinionated developer experience (DX) for building database backed web apps with AWS. Focus on business logic instead of glue code and only pay for services while in use, on demand, and otherwise _scale to zero_. 

### Work locally

Devs need to work locally, to debug, test, and preview code before deploying it. Faster iterations means removing latency in feedback cycles. Architect devs iterate even faster with identical staging and prodiction deployment only seconds away. Other systems require you to figure out these environments and more often than not ad hoc implementations introduce bug vectors due to subtle incompatabilities. Architect treats local development, staging and production as first class concerns.

### Infrastructure as Code

At its heart Architect is an [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) (IaC) framework. Architect defines a high level manifest file, in multiple open text formats, and turns formerly complex cloud infrastructure provisioning into a build artifact. You define the cloud infrastructure your application code requires and check that manifest into version control so infra and code are always aligned and determinstic. Architect compiles manifest code into AWS CloudFormation and deploys it. Architect supports a native text file format `app.arc` in addition to popular formats: `package.json`, `arc.json`, `arc.yaml` and `arc.toml`. Teams can choose the dialect that works best for them. 

### Secured to least privilege by default

Architect apps are compiled into AWS SAM applications for deployment with CloudFormation. All resources defined in the manifest share one IAM Role with least priviledge access to only resources deined in the same file. You can modify the generated CloudFormation to change this behavior, lock things down further or to access AWS resources outside the scope of the current app.

### Open source and open governance

Architect is part of the OpenJS Foundation and is Apache 2.0 licensed. Architect as an open source project prioritizes regular release candance and backwards compatability at all costs. 
