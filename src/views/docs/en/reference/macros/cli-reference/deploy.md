---
title: deploy
description: Architect deploy is a module to deploy SAM and CloudFormation templates to an AWS account
sections:
  - Overview
  - Usage
  - Flags
---

## `Overview`

[`@architect/deploy`](https://github.com/architect/deploy) is a deployment module that deploys Architect applications to cloud infrastructure. `arc deploy` deploys code in `src` with CloudFormation and public by directly uploading files to S3.

This module also deploys code found in `/src` to `staging`. If `ARC_DEPLOY=production` is set, the code in `/src` will be deployed to `production`. (A lot of other things happen under the hood, outlined below.)

If the local `app.arc` file has defined (and created) `@static` folders, they are deployed to the an S3 bucket. 

**To deploy your project to AWS, you'll need:**

- A supported runtime
- AWS CLI
- (Which requires Python)
- AWS account with admin privileges
- Your credentials file set up at:
  - *nix: ~/.aws/credentials
  - Windows: C:\Users\USER_NAME\.aws\credentials

## Looking under the hood at `deploy`

Architects deploy process does a number of things during each deploy! In summary:

1.) Checks for valid `package.json` & `package-lock.json` files in each function
2.) Removes each function's local `node_modules` folder and does a fresh install of all modules
3.) Populates each function with [`arc` shared code](/guides/sharing-common-code) via `/src/shared`
4.) Compresses and uploads each function directory to its corresponding Lambda function

> Reminder: All `arc` NPM scripts require `profile` and `region` variables set, either as  environment variables or in `@aws` within your `app.arc` manifest. Learn more in the [Prerequisites guide](/quickstart).

## Usage

> **Requirements:** You need to have the SAM command-line utility available on your $PATH. Check out [AWS' docs](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) for instructions on how to install this.

- `arc deploy` deploys to a staging stack
- `arc deploy dirty` overwrites static lambda with local source (fast!)
- `arc deploy production` deploys to a production stack
- `arc deploy static` deploys static assets only
- `arc deploy --dry-run` creates a CloudFormation template but does not deploy it

Additional considerations:

- If `package.json`, `requirements.txt` or `Gemfile` are found, dependencies will be installed
- Copies `src/shared` and `src/views`

## Flags

`[dirty, --dirty, -d]`
Overwrites a lambda with the local source. This should only be considered a temporary deployment because the next full deploy will update all functions. This is a faster way to deploy and test small changes to individual functions, without redeploying everything in the stack. Dirty deploys only go to staging.
`[--dry-run ]`
Creates a CloudFormation template, but does not deploy it. A dry-run allows you to check the CloudFormation and SAM output before deploying the actual stack.
`[production, --production, -p]`
Deploys a CloudFormation stack to the production environment, with it's resources separate from staging.
`[prune, --prune]`
Removes static assets not present in the local static folders
`[static, --static, -s]`
Deploys only the files in the static folder
`[verbose, --verbose, -v]`
Displays the full deploy status messages
`[tags, --tags, -t]`
Adds resource tags to the CloudFormation stack
`[name, --name, -n]`
Adds custom name to CloudFormation stack
