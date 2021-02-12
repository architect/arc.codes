---
title: Route 53
description: Setting up a domain name with Route 53
sections:
  - Overview
  - Purchase/Transfer domain
  - Get AWS Certificate
  - Map domain names
---

## Overview

Follow these instructions to manually configure Route 53 to serve your application from your domain. Per the [Start here](/docs/en/guides/domains/start-here) section, you should have already deployed your arc app to `staging` and `production` and saved the `URLs` for later steps below.

> ⛳️ Tip: These instructions will serve your app's `production` environment; if you'd also like a friendly URL for your `staging` environment (i.e. staging.example.com), follow steps 10-15 below a second time, swapping `production` values for `staging` values.

## Step 1: Purchase/Transfer domain

Depending on your situation, you may be ready to purchase a brand new domain or transfer a domain from a different registrar. Buying a brand new domain is a quick and straightforward process while transferring in a domain will vary from each user's situation.

### Purchase domain

To purchase a domain, sign into the AWS Console, head to the Route 53 service. Check to see if the domain you want is available. If it is available, follow the instructions to purchase the domain. When you register your domain via Route53, it gets added to a `hosted zone` automatically. The `hosted zone` is where you will manually configure your DNS.

### Transfer Domain

To transfer the registration for a domain to Amazon Route 53, carefully follow the procedures in this article from the AWS documentation.

[Transferring registration for a domain to Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-transfer-to-route-53.html)

## Get SSL Certificates

Now that you have your domain, let's request a SSL certificates from AWS Certificate Manager.

- **Pro-tip:** set up both `example.com` and `staging.example.com` for use with subdomains.
- Click the `Get started` button in the Provision certificates section. 
- Follow the instructions to add certs to the hosted zone DNS. 
- The certificates may say `pending` for a few hours until it propagates. 

## Map domain names

Sign into AWS API Gateway. Follow these intrructions for adding both `production` domain and `staging` domain.

- Click on **Custom Domain Names**
- Create a **Custom Domain Name** for `production`
- Fill in the form:
  - Enter the exact FQDN you intend to use (i.e. `arc.codes` or `www.foo.com`) in the **Domain Name** field
  - Select the **ACM Certificate** you just verified
  - Click `Create domain name`
  - Enter `/` in the **Path** field
  - Select your app's `production` API name in the **Destination** menu
  - Select the `production` value in the **Stage** menu
- Copy the value of the generated **Distribution Domain Name** to your clipboard

### Head back to Route 53 and click into the domain in question.

- Create a **Record Set**
- Fill in the form:
  - If setting a subdomain, enter it in the **Name** field
  - Click `Create Record`.
  - Change `Record type` to `A`.
  - Make sure `Routing policy` is set to `Simple routing`.
  - Make sure `Record type` is set to `Routes traffic to an Ipv4 address and some AWS resources`.
  - In the `Value/Route traffic to` sections:
  - Set to `Alias to Cloudfront distribution`.
  - Pick a `region`.
  - Copy and paste the alias value from Begin into the `Choose Distribution` input. It should be a Cloudfront link like this: `d1poav0i4gjqri.cloudfront.net`
  - Click `Create record`.
- Perhaps grab a cup of coffee or tea ☕️ – it can take a few minutes while AWS wires everything up!