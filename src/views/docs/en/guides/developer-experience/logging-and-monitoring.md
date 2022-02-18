---
title: Logging &amp; monitoring
category: Developer experience
description: How to use log output in your Architect project
---

Architect logs to [AWS CloudWatch](https://aws.amazon.com/cloudwatch/).


## Supported runtimes

- **Node** `console.log` or any logging library that writes to stdout or stderr
- **Deno** `console.log` or any logging library that writes to stdout or stderr
- **Ruby** `puts` or any logging library that writes to stdout or stderr
- **Python** `print` or any logging library that writes to stdout or stderr


### See also

- CloudWatch captures many metrics from [Functional Web App](https://fwa.dev) primitives, especially [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-metrics-and-dimensions.html)
- [X-Ray](https://aws.amazon.com/xray/) offers deeper service call introspection capabilities
- There are many third party tools to further extend your app with structured logs


## Example

Given the following `app.arc` file:

```arc
@app
example-app

@http
get /
```

To view the staging logs for the `get /` handler:

```bash
arc logs src/http/get-index
```

To view the production logs:

```bash
arc logs production src/http/get-index
```
