# `@aws`

## `@aws` is a vendor-specific space for declaring your AWS region & profile

### Syntax
- Accepts values for either or both of two keys:
  - `region`: [AWS region ID](https://docs.aws.amazon.com/general/latest/gr/rande.html) of the region you'll deploy this project to
  - `profile`: name of the profile you prefer to use with this project, as defined in your local [AWS profile](/quickstart)

For more on working with AWS, please see: [Multiple AWS Accounts](https://arc.codes/guides/multiple-aws-accounts).

Alternatively, if you want a less granular approach, you can declare your preferred region and profile in your `.bashrc` ([more information here](https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html)).

If you have AWS exports in your `.bashrc` and `@aws` specified in your `.arc` project, the `@aws` section will win.


### Example
For example, to deploy to the northern California AWS AZ with your AWS `work` profile's credentials, use:

```arc
@aws
region us-west-1
profile work
```

## Next: [Setup DNS with `@domain`](/reference/domain)
