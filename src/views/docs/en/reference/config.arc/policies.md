---
title: '@aws policies'
description: Lambda function `policies`
---

Configure custom Lambda function `policies`, enabling granular and specific privileges and access controls.

The `policies` setting takes one or more IAM policy ARNs or AWS-managed policy names (e.g. `AmazonDynamoDBFullAccess`).

Configuring one or more policies will completely remove all of Architect's default Lambda privileges. To restore Architect's default privileges, include a policy named `architect-default-policies`.

> Note: `architect-default-policies` is an internal Architect framework setting based on the least-privilege permissions specific to your project. It is not a managed / public IAM policy, and will not be found in your AWS console.


## Examples

Lambda only has a single set of permissions (as defined by the AWS-managed `S3CrudPolicy` policy):

```arc
@aws
policies
  S3CrudPolicy
```

Lambda has both an AWS-managed policy (`S3CrudPolicy`) and all default Architect permissions:
```arc
@aws
policies
  S3CrudPolicy
  architect-default-policies
```

Terser single-line version of the above example:
```arc
@aws
policies S3CrudPolicy architect-default-policies
```

---

## Additional resources

- [AWS IAM policy ARNs](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-arns)
- [Community-maintained list of AWS-managed policies](https://github.com/z0ph/MAMIP/tree/master/policies)
