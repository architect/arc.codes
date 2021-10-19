---
title: Route53 & CloudFront
category: Domain Registrars
description: Setting up a domain name with Route53 and CloudFront
---

## Prerequisites

- [Register](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html) or [transfer](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-transfer-to-route-53.html) a domain with Route53
- Deploy an app with Architect and make note of the `staging` and `production` URLs

## Step 1: setup SSL certificates with AWS Certificate Manager

In this step we will request a certificate from Amazon for our domain.

- Open up AWS Certificate Manager in the AWS Console in `us-east-1` (region is required!)
- Click `Request a certificate` and then `Request a public certificate`
- Ensure `example.com` and `*.example.com` for sub domains to work
- Choose `DNS validation` and click `Next`
- Add any tags and confirm the request
- Expand the domain and click `Create record in Route53` button
- Verify CNAME record created in Route53 console Hosted zone

## Step 2: setup CloudFront

Generate a CloudFront distribution with the certificate from step 1.

- Sign into AWS CloudFront in the AWS Console
- Click `Create Distribution` and then click `Get Started`
- Enter the URL from API Gateway in `Origin Domain Name`
- Set `Origin Protocol Policy` to `Match Viewer`
- Set `Viewer Protocol Policy` to `Redirect HTTP to HTTPS`
- Set `Allowed HTTP Methods` to `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
- Set `Compress Objects Automatically` to `Yes`
- Enter the domain alias in `Alternate Domain Names` (which you will configure in step 3)
- Set `SSL Certificate` to `Custom SSL Certificate` and select the cert from step 1
- Click `Create Distribution`

## Step 3: configure the domain Alias in AWS Route53

- Sign into AWS Route53 in the AWS Console
- Navigate to the Hosted zone for the domain
- Click `Create record`
- Enter the `Record name`
- Record type is `A` and toggle `Alias` checkbox on
- Select `Alias to CloudFront`
- Select the region
- Select the CloudFront distribution domain (should be the same value as the domain generated in Step 2)
- Click `Create records`

## Conclusion

Now we're done! You can check to see if your domains are online with this [DNS Checker tool](https://dnschecker.org/).
