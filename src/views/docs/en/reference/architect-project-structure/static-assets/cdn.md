---
title: CDN
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - Provision
  - Best practices
  - Cache invalidation
---

## Overview

Architect projects support the ability to add a content delivery network (CDN) with AWS CloudFront. Amazon CloudFront is a mature and powerful content delivery network that speeds up distribution of your static and dynamic web content, such as .html, .css, .js, and image files, to your users. CloudFront delivers your content through a worldwide network of data centers called edge locations. When a user requests content that you're serving with CloudFront, the user is routed to the edge location that provides the lowest latency (time delay), so that content is delivered with the best possible performance.

## Provision

Given the following `.arc` file:

```bash
@app
my-site

@cdn
@static
```

Running `arc deploy` will create a CloudFront distribution for the S3 bucket website URL.

Likewise, the following `app.arc`:

```bash
@app
my-site

@cdn
@static
@http
get /api
post /graphql
```

Running `arc deploy` will create a CloudFront distribution for the S3 website and the API Gateway routes defined by the `@http` primitive.

## Best practices

**⚠️ Important!**

CloudFront support is implemented independently of CloudFormation because the deployment performance combining these services is unacceptably slow.

Unfortunately when CF distributions are deployed via CloudFormation they are updated every deployment and this can push the feedback cycle 15 to 20 minutes. For this reason Architect creates a CDN distribution if you have `@cdn` in the `app.arc` asynchronously via the AWS SDK and when it is available you will see cloudfront.com URLs printed into the console. Likewise, removing `@cdn` from the distribution will mark it for deletion (which itself can take a long time).

## Cache invalidation

Enable fingerprinting in `app.arc`:

```bash
@app
my-site

@cdn
@static
fingerprint true
```

This ensures your application can be updated independently of long lived caches.
