---
title: Deployment
---

Architect makes deploying AWS CloudFormation completely painless.

## Deploy to staging

Deploy a CloudFormation template to a `staging` environment.

```bash
arc deploy
```

> Protip: create arbitrary named staging environments with `arc deploy --name [your name]`

## Deploy to production

Deploy a CloudFormation template to an identical `production` environment.

```bash
arc deploy production
```

## Deploy a function directly to staging

Rather than deploying the entire stack with CloudFormation you can quickly deploy code for one funnction to `staging` by supplying a path.

```bash
arc deploy path/to/code
```

## Deploy static assets to S3

Sometimes you need to update the frontend!

```bash
arc deploy static
```
