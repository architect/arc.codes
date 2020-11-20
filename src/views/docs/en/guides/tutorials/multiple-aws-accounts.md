---
title: Multiple AWS accounts
description: setting up multiple AWS accounts
sections:
  - Overview

---

# Overview

It is common to accrue AWS accounts in this modern era of cloud computing. If you are lucky enough to have this problem: congratulations! It is a huge privilege to wield such awesome power. 

AWS allows for multiple accounts by setting profile and region with environment variables:

- `AWS_PROFILE`
- `AWS_REGION`

If you do not specify these environment variables it will fallback to whatever credentials you defined for your `[default]` in `~/.aws/credentials` (or `C:\Users\USER_NAME\.aws\credentials`).

Current ways to set these variables:

- You can set these variables in your `.bashrc` (or equivalent); [more from AWS on env vars here](https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html)
- Use `npm run` scripts and hardcode the credentials into the project
- Add them on the command line when running commands (e.g. `AWS_PROFILE=brian npx create`)

> 🔥 Tip: Windows users will want to use [cross-env](https://www.npmjs.com/package/cross-env) for cross platform env vars.


