# Prerequisites

This project assumes you are running Node `8.10.x` and npm `6.0.x` locally. Please keep in mind that AWS Lambda runs Node `8.10.x`.

## AWS Setup

You'll need an Amazon Web Services account and credentials set up on your development machine. If you haven't done it before, here's a useful guide for [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).
On \*nix systems AWS Credentials are listed in:

```bash
~/.aws/credentials
```

Or on Windows systems:

```bash
C:\Users\USER_NAME\.aws\credentials
```

If that file doesn't exist, create it, and add something like the following (assuming you have multiple AWS accounts):

```bash
[default]
aws_access_key_id=xxx
aws_secret_access_key=xxx

[work]
aws_access_key_id=xxx
aws_secret_access_key=xxx

[personal]
aws_access_key_id=xxx
aws_secret_access_key=xxx
```

You will also need to set a default profile and region with the environment variables 

- `AWS_PROFILE`
- `AWS_REGION`

To set these variables on Linux, macOS, or UNIX, use export in your `~/.bashrc` (or equiv):

```bash
export AWS_PROFILE=work
export AWS_REGION=us-west-1
```

To set these variables on Windows open: *Control Panel » System » Advanced » Environment Variables*.

### Useful links:
* [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
* [Amazon Configuration and Credential Files](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html)
* [Working with multiple AWS accounts](/guides/multiple-aws-accounts)

## Next: [Install Architect](/quickstart/install)
