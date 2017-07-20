# Setup

You'll need an Amazon Web Services account and credentials setup on your development machine. 

AWS Credentials are listed in:

```bash
~/.aws/credentials
```

If that file doesn't exist, create it, and add something like the following:

```bash
[work]
aws_access_key_id=xxx
aws_secret_access_key=xxx

[personal]
aws_access_key_id=xxx
aws_secret_access_key=xxx
```

All arc npm run scripts require `AWS_PROFILE` and `AWS_REGION` environment variables set. Having your personal AWS setup seperated from the work one is just a suggestion! You could call them anything. You can learn more about AWS creds from the source: [Amazon Configuration and Credential Files](http://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html).

### Next Steps

- [Install architect](/quickstart/install)
