---
title: Custom domain
category: Domains
description: How to use a custom domain with Architect
---

## Goals

Deploy an Architect app to an owned AWS account and access that application at a custom domain name.

This assumes you have Architect working locally and [connected to your AWS account](/docs/en/guides/developer-experience/create-aws-credentials).

For this guide, we will walk through setting up an existing Architect (+ Enhance) app with the domain: `hnr.app`.

Additionally, we will skip a "staging" deploy and domain, but that is highly recommended and follows the same steps. This guide will add SSL certs for wildcard subdomains, allowing you to use `staging.example.com`.

### Resources created

When the process is complete, these resources will be created in AWS.

- a CloudFormation "Stack" with `arc deploy` (you may already have one!)
- an API Gateway "Custom Domain" + mapping
- two ACM certificates
- a CloudFront "Cache policy"
- a CloudFront "Origin request policy"
- a CloudFront "Distribution"

Additionally, two DNS records on the domain will be created/changed.

You likely will not need to modify these in the future. Depending on the needs of your application, you may want to alter CloudFront policies, but we recommending starting with these and optimizing later.

## Deploy with Architect

The application must exist in our AWS account to start the domain process.  
If you already have a deployed app, proceed to the next section.

1. run the application locally with `arc sandbox`
2. check `@aws` config in your Arc app manifest (typically `app.arc`)
	1. runtime, region, etc
	2. make not of the region you have selected
3. run a production deploy: `arc deploy --production`
4. confirm the CloudFormation stack was created in the expected region

![CloudFormation stack](/images/custom-domain/1.png)

5. set env variables
	1. `npx arc env -a -e production ARC_APP_SECRET keyboardcat`
6. deploy again so that your application picks up the env variables
7. `arc` will provide a `amazonaws.com` API Gateway URL; confirm your app is reachable

Depending on the functionality of your application, you should be able to see its primary functionality working in the browser.

## SSL Certificates

We will create two public certificates in Amazon Certificate Manager (ACM)

1. AMZN Cert Manager > request

![ACM request](/images/custom-domain/2.png)

2. New cert should be in the same region as your application:
	1. choose public certificate
	2. Enter your domain like `example.com` **AND** `\*.example.com`
	3. select DNS validation
	4. RSA 2048 for encryption
3. After the cert is created, grab the DNS validation CNAME and Value

![ACM validation](/images/custom-domain/3.png)

4. Add the validation record to your DNS provider (if you're using AWS, this is a Route53 HostedZone)

![ACM validation](/images/custom-domain/4.png)

5. wait for the cert validation to show "Issued" and "Success"

![ACM issued](/images/custom-domain/5.png)

6. Repeat in us-east-1! (we use this later for CloudFront)
	1. The CNAME record will likely be the same and the cert will be quick to validate

## API Gateway Custom Domain

Navigate to the API Gateway console for the same region where your app resides.

1. Find the "Custom domains" section and choose "Create"
	1. Enter your domain
	2. Select "Regional" for type (Arc apps are not typically of the REST API Gateway type)
	3. The ACM cert select should have an option for your new cert

![API Gateway custom domain](/images/custom-domain/6.png)

2. After creation, configure "API mappings"

![API Gateway mappings](/images/custom-domain/7.png)

3. Select the API Gateway for your app (this was created earlier with `arc deploy`), use the `$default` stage, and leave path blank

![API Gateway mappings](/images/custom-domain/8.png)

4. Copy the custom domain's "API Gateway domain name". We need it in the next step.

## CloudFront

### Policies

We'll create a couple CloudFront behavior policies to use with the distribution we'll create later.

These are the recommended policies for getting started as they're fairly permissive and do not strip much from the original request and cache more broadly than other AWS preset policies.

Policies can be changed later as your application requirements become more clear and change.

#### Cache policy

The cache policy determines what attributes of a request will create a cache key - essentially a unique object in the cache.

We always cache on query strings (search params), as that represents a unique query to the server. Additionally, compression is supported for both Gzip and Brotli.

Further, it is a safe bet to include Authorization headers in the cache key, even if your application is not yet using that header. Again, this can be altered for your app's purposes.

![Cache policy](/images/custom-domain/9.png)

![Cache policy](/images/custom-domain/10.png)

#### Origin request policy

The origin request policy determines what parts of the request will make it to our application. In this case, we want as much data as possible, including headers, query strings, and cookies.

![Origin request policy](/images/custom-domain/11.png)

### Distribution

1. CloudFront > Create distribution

![Distribution](/images/custom-domain/12.png)

![Distribution](/images/custom-domain/13.png)

![Distribution](/images/custom-domain/14.png)

![Distribution](/images/custom-domain/15.png)

2. Copy the distribution domain name

![Distribution](/images/custom-domain/16.png)

## DNS Apex record

Use the distribution domain name as the A/Apex/ALIAS for the root of your domain's DNS records.
