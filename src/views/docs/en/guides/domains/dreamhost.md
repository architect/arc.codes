---
title: Dreamhost
description: Setting up a domain name with Dreamhost
sections:
  - Overview
  - Get SSL Certificates
  - Map domain names
  - Conclusion
---

## Overview

Follow these instructions to manually configure Dreamhost to serve your application from your domain. Per the [Start here](/docs/en/guides/domains/start-here) section, you should have already deployed your arc app to `staging` and `production` and saved the `URLs` for later steps below.

This article assumes that you have already:

- signed up for Dreamhost
- purchased the domain of your choice

## Get SSL Certificates

In this step, you'll need to add two `CNAME` values to your Dreamhost DNS to verify your ownership of the domain and generate your SSL certificates for HTTPS. Now that you have your domain, let's request a SSL certificates from AWS Certificate Manager.

- Click the `Get started` button in the Provision certificates section. 
- Click `Request a public certificate`.
- **Pro-tip:** set up both `example.com` and `staging.example.com` for use with subdomains.

### Open Dreamhost DNS manager

Head back to the Dreamhost console and navigate to the `DNS records` page for your specific domain. During the SSL verification step, the first part of the name gets entered as your `CNAME` subdomain, and the value is inputted as the value. For instance, when you're provided the following `CNAME` entry:

- **Name:** `_2f9b34277e4b159e0beaa859e8802a93.example.com`
- **Value:** `_58cb94c5d71976edd03e8303fc1a126b.acm-validations.aws.`

You'll add a CNAME subdomain of 

- `_2f9b34277e4b159e0beaa859e8802a93` within your Dreamhost DNS console `Host` zone.

Then, set its `Points to` to 
- `_58cb94c5d71976edd03e8303fc1a126b.acm-validations.aws.`

Due to the eventually consistent nature of DNS-based verification, the certificates may say `pending` for a few hours until it propagates. Check back after a few minutes, and your values should be green, and you should be able to complete the next and final step.

## Map domain names

Sign into AWS API Gateway. Follow these instructions for adding both `production` domain and `staging` domain.

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

### Head back to Dreamhost and click into the domain in question.

In the final step, you'll add the final `CNAME` and `ALIAS` records to your Dreamhost. This points your domain at your arc app.
 
When you provide the `CNAME` record:

- Switch to the `CNAME` record setting.
- **Name:** `staging`
- **Value:** `exampleurl.cloudfront.net`

When you provide the `A` record:

- Switch to the `ALIAS ` record setting.
- **Name:** leave blank
- **Value** section, add the Cloudfront URL

## Conclusion

Now we're done! You can check to see if your domains are online with this [DNS Checker tool](https://dnschecker.org/).

Keep in mind that it takes a few hours for DNS to propagate fully, so be patient. Perhaps grab a cup of coffee or tea ☕️ – it can take a few minutes while AWS wires everything up!