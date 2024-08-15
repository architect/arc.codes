---
title: Get your AWS credentials
category: Get started
description: Gather required credentials from the AWS Console
---

Outlined below are the steps to create an IAM user and get the access keys required to deploy to AWS with Architect.  
An AWS account with access to create IAM users is required to complete these steps.

## Locate or create a config file

> This file is `~/.aws/credentials` on Linux and macOS systems, and `%USERPROFILE%\.aws\credentials` on Windows.

Open or create the `credentials` file (no file extension) in your favorite editor.

<small>

[Reference](https://docs.aws.amazon.com/sdkref/latest/guide/file-location.html)

</small>

## Create your IAM user

Sign in to the console and navigate to the "IAM" service.

![IAM service on AWS Console](/images/aws-credentials/1.png)

Go to the "Users" section (from the left side nav) and _click "Create user"_.

Choose a user name for an admin on your machine that runs Architect.  
_Click "Next"_

![Create new user form](/images/aws-credentials/2.png)

From the "Set permissions" section choose "Attach policies directly"  
Search for and select "AdministratorAccess".  
_Click "Next"_

!["AdministratorAccess" is checked in Set permissions](/images/aws-credentials/3.png)

Proceed to "Review and create" and _click "Create user"_ to finish creating the user.

![Review the new user entry](/images/aws-credentials/4.png)

<small>

[Reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console)

</small>

## Get your access keys

Having created a new user with the correct access, create an access key to use with Architect.

Navigate to the new user. _Click "View user"_ on the success notice.

![Success banner with View user action](/images/aws-credentials/5.png)

Visit the "Security credentials" tab below "Summary".  
_Click "Create access key"_.

![Security credentials tab for the new user](/images/aws-credentials/6.png)

Select "Other" for "Use Case".  
_Click "Next"_

![Use case is set to Other](/images/aws-credentials/7.png)

Optionally, add a "tag" or leave it blank.  
_Click "Create access key"_

![A form for the optional tag](/images/aws-credentials/8.png)

Copy the "Access key" and "Secret access key" values or download as .csv.  
_You won't have access to the secret again._  
**Do not commit these values to source control.**

Save the keys to [your config file](#locate-or-create-a-config-file):

```
[default]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

<small>

[Reference](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html)

</small>

**Architect can now use these credentials to [deploy to AWS](../../guides/developer-experience/deployment).**
