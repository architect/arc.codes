---
title: Dreamhost
description: Setting up a domain name with Dreamhost
---

## Prerequisites 

- Sign up for a domain on [Dreamhost](https://www.dreamhost.com/domains/)
- Make sure your domain is set to `DNS Only` in the Dreamhost console.
- Deploy an app with Architect and make note of the `staging` and `production` URLs
- Make sure your app is deployed to `us-east-1`

## Step 1: setup SSL certificates with AWS Certificate Manager

In this step we will request a certificate from Amazon for our domain.

- Open up AWS Certificate Manager in the AWS Console in `us-east-1` (region is required!)
- Click `Request a certificate` and then `Request a public certificate`
- Ensure `example.com` and `*.example.com` for sub domains to work
- Choose `DNS validation` and click `Next`
- Add any tags and confirm the request
- Open up Dreamhost backend and click `Manage Domains`
- Click the `DNS` link under your domain to add custom DNS records
- Create CNAME records of both issued certificates
- Wait until they change from `pending` to `success`

## Step 2: setup CloudFront

Generate a CloudFront distribution with the certificate from step 1.

- Sign into AWS CloudFront in the AWS Console
- Click `Create Distribution` and then click `Get Started`
- Enter the URL from API Gateway in `Origin Domain Name` 
- Set `Origin Protocol Policy` to `Match Viewer`
- Add the `Alternate Domain Names (CNAMEs)` that you will be using. ex. `example.com`.
- Set `Viewer Protocol Policy` to `Redirect HTTP to HTTPS`
- Set `Allowed HTTP Methods` to `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
- Set `Compress Objects Automatically` to `Yes`
- Set `SSL Certificate` to `Custom SSL Certificate` and select the cert from step 1
- Click `Create Distribution`
- Repeat for `staging` domain.

## Step 3: configure the domain Alias in Dreamhost 

Add `Alias` and `CNAME` records to DNS.

- Sign into Dreamhost
- Navigate to the domain by clicking `Manage Domains` in the sidebar.
- Click `DNS` under the domain
- Click `Add Record`
- Use record type `Alias` for the root domain. 
    - Leave `Host` input blank and add the Cloudfront domain that was created in step 2 to the `Points to` input.
- Use record type `CNAME` for the `staging` domain. 
    - Add the word `staging` to the `Host` input and add the Cloudfront domain that was created in step 2 to the `Points to` input.
- Click `Add records`

## Conclusion

Now we're done! You can check to see if your domains are online with the DNS checker tool provided by Dreamhost. You can also use this [DNS Checker tool](https://dnschecker.org/).
