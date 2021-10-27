---
title: Quickstart
category: Get started
description: Get started quickly with Architect
---

> Architect is a simple tool to build and deliver powerful cloud function-based web apps and APIs

Assuming Node.js 14+ is installed, open your terminal and create a new Architect project:

```bash
npm init @architect new-app
```

Start the local dev server:

```bash
cd new-app
npx arc sandbox
```
> `Cmd / Ctrl + c` exits the sandbox


## Deploy to AWS

Deploy to your built-in `staging` environment:

```bash
npx arc deploy
```
> Protip: create additional named development environments with the `--name` flag

Ship to your built-in `production` environment:

```bash
npx arc deploy --production
```

> Be safe! Set the `ARC_APP_SECRET` environment variable in production to secure your HTTP sessions; more information in the [`env` CLI reference](../../reference/cli/env)
