---
title: Configuration
description: Configuration options for deploying to AWS
sections:
  - Deploy buckets
  - Default runtime
  - Example
---

## S3 Buckets for Deploy artifacts

You can declare an existing S3 bucket, in the same region, to hold your CloudFormation deployment artifacts in the `.arc` file under the `@aws` pragma. 

If a bucket is not defined then Architect will create an S3 bucket for you. 

Be sure to note that AWS has [bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules)

## Default runtime 

You can assign a default runtime for all the Lambda Functions in this project. The available options are listed below, and will be supported as long as [AWS also supports it](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html).
- `nodejs12.x` (default)
- `nodejs10.x`
- `deno`
- `python3.8`
- `python3.7`
- `python3.6`
- `go1.x`
- `ruby2.5`
- `dotnetcore2.1`
- `java11`
- `java8`

If a `.arc-config` file is present in your functions folder, that specified runtime will override what is written in the `.arc` file.


## Example

Take a look at this example `@aws` entry in the `.arc` file.

```md
@aws
region  us-east-1           # AWS region ID where you will deploy this project
profile default             # Name of the profile this project uses 
bucket  your-unique-bucket  # Name of the S3 bucket to hold the CloudFormation artifacts
runtime nodejs12            # Optional declaration of a default runtime for your Lambda Functions
```
If you have a `default` AWS profile configured in the AWS CLI, Architect will use that default profile to make deployments and you don't have to use `@aws` at all.

