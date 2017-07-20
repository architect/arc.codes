# Introduction

Functions as a service is a recent conclusion of cloud computing. The iron age of compute racked physical servers. Early cloud compute evolved past physical servers with virtual machines. And most recently, in what appears to be an ever tightening cycle, containers have given rise to *cloud functions*. Each age has taught new lessons for building software architectures and this most recent iteration changes the shape of the challenges we face.

## Early Cloud Computing Wins

The cloud brings significant advances to our ability to deliver software:

- 100% utilization: only pay for what you use
- Focus on your domain logic free of infrastructure scaling concerns
- Patches, backups, security, auditing, monitoring are all managed and improving
- Elastic availability of services is becoming a standard feature
- Zero downtime deploys to meet industry expectation of always on availability

## Problem?

VM's and containers are not problem free.

- It can be a nebulous Cloud. Even the errors are eventually consistent! Failure is common, expected really, and software needs to bake in service discovery, retry logic
- Elastic scaling of server instances often just load balanced monolithic applications
- Setting up the infrastructure is difficult, time consuming and complex
- Full deployment cycles with zero downtime take a long time to complete
- Costly billing and rising costs (smallest unit of compute is your entire app)

## Cloud Functions

With functions as a service cloud providers have signaled the smallest billable unit of computation is a single function execution. It is a beautifully simple idea to reject the metaphor of a server which frees developers to design smaller and simpler services. We can iterate on our code with a high degree of isolation, without fear of effecting other parts of the system, deploy systems in seconds with zero downtime and always be available regardless of load.

And of course with new solutions we have introduced new problems! Next up look at the [concepts](/intro/concepts) behind the design of `.arc` to address these problems.
