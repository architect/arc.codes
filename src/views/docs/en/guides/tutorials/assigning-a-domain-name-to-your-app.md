---
title: Assigning a domain name to your app
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - Setup
  - DNS with 3rd party provider
  - DNS with Route53
  - TBD
---

## Overview

Give your Architect application a proper domain name

DNS is how you assign a domain name to a deployed app. This guide lists ways to set up custom DNS with several popular DNS providers and we are always happy to accept contributions for steps to use additional providers.

## Setup

Setting up `app.arc` with a custom domain name

`arc` has built-in first-class support for setting up DNS and assigning a domain. First add [`@domain`](/en/reference/arc-pragmas/@domain) to your `app.arc` file with a value of the domain name you wish to set up.

```bash
@app
testapp

@domain
doesbrianlerouxusepromisesyet.com

@http
get /
```

From here you have two paths to mapping the DNS records:

0. DNS with a third party provider (often the domain registrar) using `npx dns`
1. DNS with Route53 fully automated `npx dns route53`


## DNS with 3rd party provider

When to do this: if you registered the domain with someone other than Amazon and do not want to move the name servers.

Run `npx dns` and follow the instructions. The process is:

1. Initial run of `npx dns` will display (or create) a certificate request CNAME name/value pair
2. Enter the new CNAME record into your DNS provider and wait for verification
3. Re-run `npx dns` to generate CloudFront distributions
4. Enter the generated CloudFront distribution domains as either A or CNAME records with your DNS provider

The certificate, CloudFront distributions and DNS records in general can take time to propagate. Be Zen! Running and re-running `npx dns` is safe.

## DNS with Route53 (opt-in, but recommended!)

When to do this: if you want to use Route53 to manage your DNS records.

Run `npx dns route53` and follow the instructions. The process is:

1. Read (or create) a Route53 Hosted Zone with the value of `@domain` from the `app.arc` file and a certificate validation CNAME record
  a. If you registered the domain with AWS the name servers are mapped automatically
  b. If you registered the domain elsewhere you need to ensure the name servers are set with your domain registrar
2. After a few minutes the certificate is automatically verified
4. Re-run `npx dns` to generate CloudFront distributions and automatically map them with Alias records

## Starting Over

If something goes wrong you can destroy the generated resources and re-create.

- `npx dns nuke` destroys the certificate and CloudFront domain distributions
- `ARC_NUKE=route53 npx dns nuke` destroys the certificate, CloudFront domain distributions, the Hosted Zone, certificate validation CNAME and Alias records

> 🤷🏽‍♀️ DNS propagation can take time: have patience!


## The Not-Hard-But-Not-Quite-As-Easy Way

If you _really_ want to manually configure DNS you can follow these guides below:

* [Route 53](#route-53)
* [Cloudflare](#cloudflare)

<a name="route-53"></a>


## Route 53

Follow these instructions to manually configure Route 53 to serve your application from your domain. As a friendly reminder: the `arc` happy path for using Route 53 remains the [`@domain`](/en/reference/arc-pragmas/@domain) section (per the instructions above).

> ⛳️ Tip: These instructions will serve your app's production environment; if you'd also like a friendly URL for your staging environment (i.e. `staging.foo.com`), follow steps 10-15 below a second time, swapping `production` values for `staging` values.

1. Sign into the AWS Console, head to the Route 53 service, and click on **Hosted Zones**
2. Create a **Hosted Zone**
3. Copy the designated name server addresses to your domain registrar
  - Note: if you register your domain via Amazon, this happens automatically
4. Sign into AWS Certificate Manager
5. Request a certificate
  - Protip: set up both `example.com` and `*.example.com` for use with subdomains
6. Follow the instructions to verify the certificate
7. Sign into AWS API Gateway
8. Click on **Custom Domain Names**
9. Create a **Custom Domain Name** for `production`
10. Fill in the form:
  - Enter the exact FQDN you intend to use (i.e. `arc.codes` or `www.foo.com`) in the **Domain Name** field
  - Select the **ACM Certificate** you just verified
  - Enter `/` in the **Path** field
  - Select your app's `production` API name in the **Destination** menu
  - Select the `production` value in the **Stage** menu
11. Copy the value of the generated **Distribution Domain Name** to your clipboard
12. Head back to Route 53 and click into the domain in question
13. Create a **Record Set**
14. Fill in the form:
  - If setting a subdomain, enter it in the **Name** field
  - Set **Alias** to `yes`
  - Enter **Distribution Domain Name** you just copied to your clipboard into the **Alias Target** field
15. Create the `Record Set`
16. Perhaps grab a cup of coffee or tea ☕️ – it can take a few minutes while AWS wires everything up!

## Cloudflare

These instructions are adapted from the tutorial at [LEANX](https://www.leanx.eu/tutorials/set-up-amazons-api-gateway-custom-domain-with-cloudflare) and updated to our most recent experience deploying this documentation site to AWS, using `arc` and custom DNS via Cloudflare. Your mileage may vary.

1. Ensure that your domain is registered and is using the Cloudflare name servers and that your `arc`-generated application has been deployed to AWS
2. In your AWS management console, go to the Certificate Management service, and ensure you are in the US East (N. Virginia) aka `us-east-1` region
3. Click on "Import a certificate"
4. In a different browser tab or window, log into Cloudflare, select your domain and open the `Crypto` tab. In the SSL section, ensure SSL is set to **Full**
5. Scroll down to the **Origin Certificates** section and click `Create Certificate`
6. Let Cloudflare generate a private key and a CSR and choose RSA as the private key type
7. Make sure that the hostname for your custom API domain is covered (i.e. `api.foo.com`). You can specifically configure this custom domain or use a wildcard such as `*.foo.com`, as is configured by default
8. Pick PEM as the key format which is selected by default
9. Copy the Certificate body from your Cloudflare certificate to the **Certificate body** field in the AWS Certificate Manager
10. Copy the Private key to the **Certificate private key** field in the AWS Certificate Manager
11. In the **Certificate chain** field in the AWS Certificate Manager, copy the [Cloudflare Origin CA - RSA Root found here](https://support.cloudflare.com/hc/en-us/articles/218689638-What-are-the-root-certificate-authorities-CAs-used-with-CloudFlare-Origin-CA-)
12. Click **Review and import** and then import the certificate. Take note of the first eight characters of the certificate's identifier as you will need that to select the correct certificate in a later step
13. In the AWS Console, return to the region in which you are deploying your architect-generated application and then go to the API Gateway Service
14. Click on **Custom Domain Names** and then **Create Custom Domain Name**
15. Enter your custom domain name in the AWS Console and select the certificate which you created earlier and noted the identifier
16. Add any **Base Path Mappings** as necessary for your application
17. Now the custom domain name will be created in AWS CloudFront. It can take up to an hour before the domain becomes active
18. The final step is to create a new CNAME record in Cloudflare to link your custom domain to the CloudFront URL which you can copy from the Distribution Domain Name in the Custom Domain Names console. Ensure that the option 'DNS and HTTP proxy (CDN)' is selected for this CNAME after creation

