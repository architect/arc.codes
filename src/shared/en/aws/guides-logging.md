# Logging & Monitoring

## Get instant access to clean, readable logs, isolated by function


Architect generally relies primarily on AWS's standard means of logging: CloudWatch. Here's how it works, and can be extended:

- Good old fashioned `console.log` will show up in [CloudWatch](https://aws.amazon.com/cloudwatch/)
- CloudWatch events offers a ton of metrics
- [X-Ray](https://aws.amazon.com/xray/) offers deeper service call introspection capabilities
- There are many third party tools to further extend your app with structured logs

<hr>


## Next: [Assigning a Custom Domain Name](/guides/custom-dns)
