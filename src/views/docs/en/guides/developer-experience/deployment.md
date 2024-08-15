---
title: Deployment
category: Developer experience
description: How to deploy your Architect app
---

Architect makes deploying AWS CloudFormation "stacks" painless.  
AWS credentials are required to deploy.
Learn about [AWS setup](../../get-started/detailed-aws-setup) and [gathering credentials from the AWS Console](./create-aws-credentials)

> 🧑‍🏫  CloudFormation stack identifiers are created from the name specified in the `@app` pragma and are unique to an AWS region. Changing the project name or region will create a new CF stack.

## Command examples

### Deploy to staging

Deploy a CloudFormation template to a `staging` environment.

```bash
arc deploy
```

> Protip: create arbitrary named staging environments with `arc deploy --name [your name]`

### Deploy to production

Deploy a CloudFormation template to an identical `production` environment.

```bash
arc deploy --production
```

### Deploy a function directly

Rather than deploying the entire stack with CloudFormation you can quickly deploy code for one function by supplying a path.

```bash
arc deploy --direct path/to/code
```

Combine with the `--production` flag to update one function to the production stack.

### Deploy static assets to S3

Sometimes you need to just update the frontend.

```bash
arc deploy --static
```

## Deployment credentials

If your machine has an AWS credentials file (`~/.aws/credentials`) but you would like to override those credentials using environment variables, you must also set `ARC_AWS_CREDS=env`. For example:

```bash
ARC_AWS_CREDS=env AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... arc deploy --production
```
