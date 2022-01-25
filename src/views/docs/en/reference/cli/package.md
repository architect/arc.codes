---
title: arc package
category: CLI
description: Generate AWS SAM template based on the current app.arc
---

Transform `app.arc` into `sam.json`. [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) can be deployed with the AWS CLI.

This command only generates SAM. It does not run Architect macros or [plugins](../../guides/extend/plugins). To create SAM config documents while executing a project's full set of features without deploying, try [`arc deploy --dry-run`](./deploy#run-deploy-without-deploying).

## Usage

```bash
arc package
```
