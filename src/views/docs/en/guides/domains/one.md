---
title: One.com
description: Setting up a domain name with One.com
sections:
  - Overview
  - Get SSL Certificates
  - Map domain names
  - Conclusion
---

## Overview

Follow these instructions to manually configure One to serve your application from your domain. Per the [Start here](/docs/en/guides/domains/start-here) section, you should have already deployed your arc app to `staging` and `production` and saved the `URLs` for later steps below.

This article assumes that you have already:

- signed up for One.com
- purchased the domain of your choice

## Get SSL Certificates

In this step, you'll need to add two `CNAME` values to your One DNS to verify your ownership of the domain and generate your SSL certificates for HTTPS. Now that you have your domain, let's request a SSL certificates from AWS Certificate Manager.

- Click the `Get started` button in the Provision certificates section. 
- Click `Request a public certificate`.
- **Pro-tip:** set up both `example.com` and `staging.example.com` for use with subdomains.

### Verify your ownership of the domain(s).

In this step, you'll need to add two `CNAME` values to your One.com DNS in order to verify your ownership of the domain and generate your SSL certificates for HTTPS.

Head back to the One.com console and navigate to the `DNS records` page for your specific domain. During the SSL verification step, the first part of the name gets entered as your `CNAME` subdomain, and the value is inputted as the value. For instance, when you're provided the following `CNAME` entry:

- **Name:** `_2f9b34277e4b159e0beaa859e8802a93.www.example.com`
- **Value:** `_58cb94c5d71976edd03e8303fc1a126b.acm-validations.aws.`

You'll add a CNAME subdomain of 

- `_2f9b34277e4b159e0beaa859e8802a93` within your One.com `Hostname` zone.

Then, set its `Is an alias of` to 
- `_58cb94c5d71976edd03e8303fc1a126b.acm-validations.aws`

> ⚠️ Leave the trailing period off!

Due to the eventually consistent nature of DNS-based verification, it may take a few minutes for your changes to get picked up. Check back after a few minutes, and your values should be green, and you should be able to complete the next and final step.

> If for some reason after more than a few minutes your domains haven't verified, make sure that you've correctly entered the settings into your DNS.

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

### Head back to One.com and click into the domain in question.

In the final step, you'll add the final `CNAME` and `ALIAS` records to your One.com. This points your domain at your Begin app.

When you provide the `CNAME` record:

- Switch to `CNAME` record setting.
- **Hostname:** `staging`
- **Is an alias of:** `pi1f6fddqd0dje.cloudfront.net`


When you provide the `A` record:

- Switch to `A` record setting.
- **Hostname:** input `@` symbol
- Find out the IP address of the given cloudfront URL (`http://pi1f6fddqd0dje.cloudfront.net`) using a tool like [24x7.com](https://www.site24x7.com/find-ip-address-of-web-site.html)
- Lastly in the **Will point to:** section, add the IP address.

## Conclusion

Now we're done! You can check to see if your domains are online with this [DNS Checker tool](https://dnschecker.org/).

Keep in mind that it takes a few hours for DNS to propagate fully, so be patient. Perhaps grab a cup of coffee or tea ☕️ – it can take a few minutes while AWS wires everything up!