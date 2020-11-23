# Architect prerequisites

## tl;dr

**To work locally**, all you need is:
- A supported [runtime](#runtimes)

**To deploy your project to AWS**, you'll need:
- A supported [runtime](#runtimes)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
  - (Which requires [Python](https://www.python.org/downloads/))
- AWS account with admin privs
- Your [credentials file](#local-credentials-file) set up at:
  - \*nix: `~/.aws/credentials`
  - Windows: `C:\Users\USER_NAME\.aws\credentials`


## Runtimes

Architect supports the following runtime versions when working locally:

**Recommended**

- Node: `12.x` using `npm` or `yarn`
- Deno `1.3`
- Ruby: `2.5` using `bundle`
- Python: `3.7` & `3.6` using `pip3`

> Working locally with the Architect `sandbox` dev server requires target runtimes to be installed and available in $PATH. For example, if you are only targeting Node, then only Node needs to be installed locally. (Likewise for Ruby and Python.)

To use the same runtime across all functions in your project, add it to your `@aws` pragma like so:

```arc
@aws
runtime python3.7
```

> This setting can be overridden on a function-by-function basis with [`config.arc`](/reference/arc-config/runtime).

Architect also supports the following runtimes in live infra, but not while working locally (at present):
- Go: `1.x`,
- .NET: `2.1`
- Java: `8`


## AWS Setup

Architect deploys and manages your infra using CloudFormation under the hood. To `arc deploy` from your dev machine (or CI system) you'll need:
- AWS CLI
  - Here's a [handy guide for configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
  - [Python](https://www.python.org/downloads/)
- An AWS account with admin privs
  - (Used to least-privilege roles for application infra)
- [A credentials file](#local-credentials-file) set up on your development machine


### Local credentials file

Depending on your OS, your AWS credentials file will be in one of two places:
- On \*nix systems: `~/.aws/credentials`
- On Windows systems: `C:\Users\USER_NAME\.aws\credentials`

If that file doesn't exist, create it, and add something like the following (assuming you have multiple AWS accounts):

```bash
[default]
aws_access_key_id=xxx
aws_secret_access_key=xxx

[work]
aws_access_key_id=xxx
aws_secret_access_key=xxx

[personal]
aws_access_key_id=yyy
aws_secret_access_key=yyy
```

---
## Next: [Install Architect](/quickstart/install)
---

### Useful Links
* [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
* [Amazon Configuration and Credential Files](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html)
* [Working with multiple AWS accounts](/guides/multiple-aws-accounts)
