---
title: Quickstart
category: Get started
description: Get started quickly with Architect
---

> Architect is the quickest way to build serverless database backed web apps on AWS

Open your terminal to install `arc` globally:

```bash
npm i -g @architect/architect
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

Deploy the `staging` stack:

```bash
arc deploy
```
> Protip: create additional `staging` stacks with `--name`

Ship to a `production` stack:

```bash
arc deploy production
```

Or eject to CloudFormation and deploy with the AWS SAM CLI:

```
arc package
sam package --template-file sam.json --output-template-file out.yaml --s3-bucket mybukkit
sam deploy --template-file out.yaml --stack-name MyStack --s3-bucket mybukkit --capabilities CAPABILITY_IAM
```


