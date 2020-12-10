---
title: Why Architect?
category: Get started
description: Why is Architect important to you?
---

> Architect is the simplest and fastest way to build database backed web apps on AWS SAM

Architect provides everything you need out of the box to build massively scalable apps with low code, clear and terse config, and zero ceremony. Instantly create powerful serverless Lambda functions written in JS, Python, and Ruby connected to the massive AWS ecosystem with standard CloudFormation. 

- The best developer experience with fast local dev, smart configurable defaults and flexible Infrastructure as Code
- Secured to least privilege by default
- Open source and open governance

## The best developer experience

Architect is an opinionated developer experience (DX) for building database backed web apps with AWS. We know you want to focus on business logic instead of glue code. We know you want to only pay for services while in use, on demand, and otherwise _scale to zero_. We know you want to do less work about work so you can focus on doing more for your customers. That is why you chose to go serverless.

But going serverless is fraught with vendor arcana and market noise. This is where Architect comes in. We remove all the noise and friction to building serverlessly. We prioritize speed with fast local dev, smart configurable defaults and flexible Infrastructure as Code. And then we get out of your way so you can focus on your code.

#### Work locally

Devs need to work locally, to debug, test, and preview code before deploying it. Faster iterations means removing latency in feedback cycles. Architect devs iterate even faster with identical staging and prodiction deployment only seconds away. Other systems require you to figure out these environments and more often than not ad hoc implementations introduce bug vectors due to subtle incompatabilities. Architect treats local development, staging and production as first class concerns.

#### Custom source paths

Architect provides default conventions for structuring code but every default can be opted out of and projects can be organized in whatever way makes the most sense for that project. Teams can remain confident they get the same infrastructure expected every time because ultimately Architect is all about Infrastructure as Code.

#### Infrastructure as Code

At its heart Architect is an [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) (IaC) framework. Architect defines a high level manifest file, in multiple open formats, and turns formerly complex cloud infrastructure provisioning into a build artifact. You define the cloud infrastructure your application code requires and check that manifest into version control so infra and code are always aligned and determinstic. Architect compiles manifest code into AWS CloudFormation and deploys it. Architect supports a native text file format `app.arc` in addition to popular formats: `package.json`, `arc.json`, `arc.yaml` and `arc.toml`. Teams can choose the dialect that works best for them. 

## Secured to least privilege by default

Architect apps are compiled into AWS SAM applications for deployment with CloudFormation. All resources defined in the manifest share one IAM Role with least priviledge access to only resources deined in the same file. You can modify the generated CloudFormation to change this behavior, lock things down further or to access AWS resources outside the scope of the current app.

## Open source and open governance

Architect is part of the OpenJS Foundation and is Apache 2.0 licensed. Architect as an open source project prioritizes regular release candance and backwards compatability at all costs. 
