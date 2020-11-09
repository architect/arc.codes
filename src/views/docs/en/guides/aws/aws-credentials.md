---
title: AWS credentials
description: Required AWS credentials and configurations for Architect projects
sections:
  - Minimum viable permissions
  - Working with multiple profiles
  - Credentials file vs. environment variables
---

## Minimum viable permissions

Architect deploys to AWS using the AWS Command Line Interface (CLI) and CloudFormation to preserve determinism and adheres to the ideals of Infrastructure as Code. 

In order to manage resources with least privileges, the IAM user associated with deployments must have the `AdministratorAccess` [Managed Policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#aws-managed-policies). [Learn more about Creating an IAM User here.](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)

This ensures that the human developer who is maintaining the infrastructure code will have all the privileges to restrict the roles and access policies of the resources they are deploying. Therefore it is important to understand how to load these credentials under different situations which will enable your workflow. 

## Working with multiple profiles

It is common to accrue AWS accounts in this modern era of cloud computing. If you are lucky enough to have this problem: congratulations! It is a huge privilege to wield such awesome power.
[Learn more about Configuring the AWS CLI here.](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

On Linux or macOS AWS credentials are listed in `~/.aws/credentials` 
On Windows systems AWS credentials are listed in `C:\Users\USER_NAME\.aws\credentials`

An example credentials file with multiple accounts might look like this: 
```
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

[work]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE2
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY2

[demo-account]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE3
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY3
```
You also need to specify a region which is in a `/.aws/config` file with the example below:
```
[defualt]
region=us-east-1
```
This keeps your sensitive credential keys (`~/.aws/credentials`) separate from non-sensitive configuration (`~/.aws/config`). 

You can specify the AWS profile that your Architect project will use to deploy in the `app.arc` file under the `@aws` pragma 
```md
# app.arc
@aws
profile work
```

## Credentials file vs. environment variables

Alternatively, you can set AWS credentials with environment variables, which is useful for scripting and temporarily setting profiles. 

If you do not specify these environment variables, Architect will fallback to whatever credentials you defined for your `[default]` in `~/.aws/credentials` (or `C:\Users\USER_NAME\.aws\credentials`).

Current ways to set these variables:

- You can set these variables in your `.bashrc` (or equivalent); [more from AWS on env vars here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html)
- Use `npm run` scripts and hardcode the credentials into the project
- Add them on the command line when running commands (e.g. `AWS_REGION=us-west-1 arc deploy`)

> Tip: Windows users will want to use [cross-env](https://www.npmjs.com/package/cross-env) for cross platform env vars.

Architect will first give priority to credentials and configurations in the `app.arc` file, then the local credentials file, and then environment variables.