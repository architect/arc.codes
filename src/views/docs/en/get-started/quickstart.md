---
title: Quickstart
category: Get started
description: Get started quickly with Architect
---

> Architect is a simple framework for building and delivering powerful [Functional Web Apps (FWAs)](https://fwa.dev) on AWS

## Create a new project

Assuming Node.js 14+ is installed, open your terminal and create a new Architect project:

<arc-viewer default-tab=bash>
<div slot=contents>
<arc-tab label=bash>
<h5>Bash/cmd.exe</h5>
<div slot=content>

```bash
npm init @architect your-app
```
</div>
</arc-tab>

<arc-tab label=PowerShell>
<h5>PowerShell</h5>
<div slot=content>

```powershell
npm init "@architect" your-app
```
</div>
</arc-tab>
</div>
</arc-viewer>

Start the local dev server:

```bash
cd your-app
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

> Be safe! Set the `ARC_APP_SECRET` environment variable in production to secure your HTTP sessions; more information in the [`env` CLI reference](../reference/cli/env)
