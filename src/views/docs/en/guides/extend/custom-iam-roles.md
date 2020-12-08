---
title: Custom IAM roles
description: Defining custom execution roles for individual Lambda functions
sections:
  - Overview
---

## Overview

[IAM, Identity and Access Management,](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) is a feature of AWS which controls how AWS resources can be accessed by users. IAM roles use policies to define the permissions for a given resource. For example, a Lambda function will assume an IAM role during execution that tells AWS what other resources that Lambda has access to and what operations it is allowed to perform. 

Imagine that IAM roles represent different hats that a user puts on in order to perform an operation. You would put on your "Read-Only hat" to limit the scope of a Lambda execution to just reading a table and deny write access. 

You can define a custom IAM role for your Lambda Function with an `.arc-config` file in the Lambda function code folder.

By default, your functions are executed with a least privileged role, which means that it only has access to the services it needs and nothing else. 

If we take a look at the IAM policy for a Lambda function that is created by Architect, we can see that it can be executed with only the ability to create logs in CloudWatch.

```json
{
    "Statement": [
        {
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": "arn:aws:logs:*:*:*",
            "Effect": "Allow"
        }
    ]
}
```

Using a custom IAM role allows you to limit interactions even further, like restricting a Lambda to read only permissions on DynamoDB or calling resources outside of the project.

Here's how you would add a custom role to your Lambda with a `.arc-config` file.

```md
// src/http/get-orders/.arc-config

@aws
runtime nodejs12.x
memory 512mb
concurrency 1
policies arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess
```
ARNs, Amazon Resource Names, are globally unique identifiers to specify a resource. You can create new policies in the AWS console or use Managed Policies that are made available by AWS. 

[Check out the AWS documentation for more information on Managed Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#aws-managed-policies)
