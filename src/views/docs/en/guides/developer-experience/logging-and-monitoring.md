---
title: Logging &amp; monitoring
---

Architect utilizes the cloud native logging solution [AWS CloudWatch](https://aws.amazon.com/cloudwatch/). 

Here's how it works, and can be extended:

- Good old fashioned `console.log` will show up in [CloudWatch](https://aws.amazon.com/cloudwatch/)
- CloudWatch events offers a ton of metrics about your serverless primitives especially [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-metrics-and-dimensions.html)
- [X-Ray](https://aws.amazon.com/xray/) offers deeper service call introspection capabilities
- There are many third party tools to further extend your app with structured logs

The CLI syntax to view logs for a Lambda function: 

```bash
arc logs [production] path/to/function 
```

For example, given the following `app.arc` file:

```arc
@app
showlogs

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
