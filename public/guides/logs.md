# Logging & Monitoring

## Get instant access to clean, readable logs, isolated by function

Architect generally relies primarily on AWS's standard means of logging: CloudWatch. Here's how it works, and can be extended:

- Good old fashioned `console.log` will show up in [CloudWatch](https://aws.amazon.com/cloudwatch/)
- CloudWatch events offers a ton of metrics
- [X-Ray](https://aws.amazon.com/xray/) offers deeper service call introspection capabilities
- There are many third party tools to further extend your app with structured logs

To view logs for a function run `npx logs [production] path/to/function`. For example, given the following `app.arc` file:

```
@app
showlogs

@http
get /
```

To view the production logs run `npx logs production src/http/get-index`.

To clear the logs run `npx logs nuke`.

<hr>

## Next: [Assigning a Custom Domain Name](#null)
