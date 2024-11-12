---
title: Custom domain
category: Domains
description: How to use a custom domain with Architect
---

## Goals

Deploy an Architect app to an owned AWS account and access that application at a custom domain name.

This assumes you have Architect working locally and [connected to your AWS account](/docs/en/guides/developer-experience/create-aws-credentials).

For this guide, we will walk through setting up an existing Architect (+ [Enhance](https://enhance.dev/)) app with the domain: `hnr.app`.

Additionally, we will skip a "staging" deploy and domain, but that is highly recommended and follows the same steps. This guide will add SSL certs for wildcard subdomains, allowing you to use `staging.example.com`.


### Resources created

When the process is complete, these resources will be created in AWS:

- CloudFormation: one Stack (via `arc deploy`, you may already have one!)
- API Gateway: one Custom Domain + mapping
- ACM: two certificates
- CloudFront: one Cache policy, Origin request policy, and Distribution

Additionally, two DNS records on the domain will be created / changed.

You likely will not need to modify these in the future. Depending on the needs of your application, you may want to alter CloudFront policies, but we recommending starting with these and optimizing later.


## Deploy with Architect

The application must exist in our AWS account to start the domain process.
If you already have a deployed app, proceed to the next section.

1. Run the application locally with `arc sandbox`
2. Check `@aws` config in your Arc app manifest (typically `app.arc`)
	- Verify your runtime, etc., and make note of the region you have selected
3. Run a production deploy: `arc deploy --production`
4. Confirm the CloudFormation stack was created in the expected region

![CloudFormation stack](/images/custom-domain/1.png)

5. Set env variables
	- `npx arc env -a -e production ARC_APP_SECRET keyboardcat` (where `keyboardcat` is a secret of your choosing)
6. Deploy again so that your application picks up the env variables: `arc deploy --production`
7. `arc` will provide a `amazonaws.com` API Gateway URL; confirm your app is reachable

Depending on the functionality of your application, you should be able to see its primary functionality working in the browser.


## SSL Certificates

We will create two public certificates in Amazon Certificate Manager (ACM), one in the region you selected, and the other in `us-east-1`. (If you're using `us-east-1`, you only need to create a single certificate in that region.)

1. AWS Cert Manager > request

![ACM request](/images/custom-domain/2.png)

2. The new cert should be in the same region as your application:
	- Choose public certificate
	- Enter your domain like `example.com` **AND** `\*.example.com`
	- Select DNS validation
	- RSA 2048 for encryption
3. After the cert is created, grab the DNS validation CNAME and Value
  - If your domain uses Route53, you may also click the `Create records in Route 53` button to skip step 4.

![ACM validation](/images/custom-domain/3.png)

4. Add the validation record to your DNS provider (if you're using AWS, this is a Route 53 HostedZone)

![ACM validation](/images/custom-domain/4.png)

5. Wait for the cert validation to show "Issued" and "Success"

![ACM issued](/images/custom-domain/5.png)

6. Repeat in `us-east-1`!
  - CloudFront must have certificates in `us-east-1`; we'll use it later when we set up the CDN
	- The CNAME record will likely be the same and the cert should be quick to validate


## API Gateway Custom Domain

Navigate to the API Gateway console for the same region where your app resides:

1. Find the "Custom domains" section and choose "Create"
	- Enter your domain
	- Select "Regional" for type (Arc apps are not typically of the `REST` API Gateway type)
	- The ACM cert menu should have an option for the new cert you just created

![API Gateway custom domain](/images/custom-domain/6.png)

2. After creation, configure "API mappings"

![API Gateway mappings](/images/custom-domain/7.png)

3. Select the API Gateway for your app (this was created earlier with `arc deploy`), use the `$default` stage, and leave path blank

![API Gateway mappings](/images/custom-domain/8.png)

4. Copy the custom domain's ``API Gateway domain name`, which we'll need for the next step.


## CloudFront

### Policies

We'll create a couple CloudFront behavior policies to use with the distribution we'll create momentarily.

These are the recommended policies for getting started as they're fairly permissive, do not strip much from the original request, and cache more broadly than other AWS preset policies.

Policies can be changed later as your application requirements change or become clearer.


#### Cache policy

The cache policy determines which request attributes will create a cache key (essentially a unique object in CloudFront's cache).

We always cache on query strings (e.g. search params), as that often represents a unique query to the server (unless your users are logged in). Additionally, compression is supported for both Gzip and Brotli.

Further, it is a safe bet to include `Authorization` headers in the cache key, even if your application is not yet using that header. Again, this can be altered for your app's purposes.

![Cache policy](/images/custom-domain/9.png)

![Cache policy](/images/custom-domain/10.png)


#### Origin request policy

The origin request policy determines what parts of the request will make it to our application. In this case, we want as much data as possible, including headers, query strings, and cookies.

![Origin request policy](/images/custom-domain/11.png)


### Distribution

In the final step, we'll create our CloudFront distribution and get ready to ship that into your domain's DNS settings:

1. CloudFront > Create distribution

Update these settings as needed for your application:

![Distribution](/images/custom-domain/12.png)

![Distribution](/images/custom-domain/13.png)

![Distribution](/images/custom-domain/14.png)

![Distribution](/images/custom-domain/15.png)

2. Copy the distribution domain name

![Distribution](/images/custom-domain/16.png)


## Update your DNS apex record

You may now use the CloudFront distribution domain name (e.g. `$GUID.cloudfront.net`) as the `A` / `Apex` / `ALIAS` for the root of your domain's DNS records.
