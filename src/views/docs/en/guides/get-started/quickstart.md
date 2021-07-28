---
title: Quickstart
category: Get started
description: Get started quickly with Architect
---

> Architect is the quickest way to build serverless web apps on AWS

Open your terminal to install `arc` and the AWS SDK:

```bash
npm i -g @architect/architect aws-sdk
```

Check the version:

```bash
arc version
```

> Protip: run `arc` with no arguments to get help

## Work locally

Create a new app:

```bash
mkdir testapp
cd testapp
arc init
```

Kick up the local dev server:

```bash
arc sandbox
```
> `Cmd / Ctrl + c` exits the sandbox

## Deploy to AWS

Deploy to a `staging` stack:

```bash
arc deploy
```
> Protip: create additional `staging` stacks with `--name`

Ship a `production` stack:

```bash
arc deploy production
```
> Be safe! Set the `ARC_APP_SECRET` environment variable in production to secure your HTTP sessions; more information in the [`env` CLI reference](../../reference/cli/env)

Or eject to CloudFormation and deploy with the AWS SAM CLI:

```
arc deploy --dry-run
sam package --template-file sam.json --output-template-file out.yaml --s3-bucket mybukkit
sam deploy --template-file out.yaml --stack-name MyStack --s3-bucket mybukkit --capabilities CAPABILITY_IAM
```
