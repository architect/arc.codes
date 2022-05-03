---
title: Ejecting from Architect
category: Extend
description: Ejecting from Architect
---

Architect makes it very easy to cease using it in favor of any another tool or framework, such as AWS SAM.


## Ejecting to CloudFormation

In your project directory, run:

```bash
npx arc deploy --eject
```

This will generate your application's `sam.json` + `sam.yaml` documents, as well as print out the necessary AWS CLI instructions to deploy your application without Architect.


## Considerations

It is worth noting that by ejecting from Architect to "raw" AWS or another framework, you may lose access some or all of the following:

- Expansive, fast, and customizable local development environment
- Baked-in security + performance defaults
- Automated dependency management
- Workflows for managing environment variables, logs, etc.
- Single-command deployments
- Built in testing, staging, production environments
- Human-centered service discovery for machine-generated AWS resources

Either way, we at Architect hope we'll see you again in the future!
