# Prerequisites

Architect supports the following local runtimes (to mirror AWS Lambda runtimes): 

- Node `10.x`
- Ruby `2.5`
- Python `3.7`

> Working locally with `arc sandbox` requires target runtimes to be available locally; if you are only targeting Node then only Node needs to be installed (likewise for Ruby and Python) 

## AWS Setup

To `arc deploy` you will need an Amazon Web Services account and credentials set up on your development machine. Architect uses AWS CLI to deploy with CloudFormation. 

> If you haven't done it before, here's a useful guide for [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

---

## AWS Reference

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

To set these variables on Linux, macOS, or UNIX, use export in your `~/.bashrc` (or equivalent shell configuration):

```bash
export AWS_PROFILE=work
export AWS_REGION=us-west-1
```

Or for Windows, add this to your PowerShell `$profile`:

```powershell
$env:AWS_PROFILE='work'
$env:AWS_REGION='us-west-1'
```

If you prefer, you can also use: *Control Panel » System » Advanced System Settings » Environment Variables*.

---

## Useful Links
* [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
* [Amazon Configuration and Credential Files](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html)
* [Working with multiple AWS accounts](/guides/multiple-aws-accounts)

---
## Next: [Install Architect](/quickstart/install)
---
