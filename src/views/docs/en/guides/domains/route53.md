---
title: Route 53
description: Setting up a domain name with Route 53
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

## Step 2: setup custom domain with AWS API Gateway

Generate a domain with the certificate from Step 1.

- Sign into AWS API Gateway in the AWS Console
- Navigate to `Custom domain names` and click `Create`
- Enter the domain name (eg. `staging.example.com` for the `staging` app or `example.com` for the `production` app)
- Select the certificate created in Step 1
- Click `Create domain name`
- Make note of the generated `API Gateway domain name` in `Endpoint configuration`
- Click on the tab `API mappings` and `Configure API mappings`
- For `API` select the API and for `Stage` select `$default` and click `Save`

## Step 3: configure the domain Alias in AWS Route53

- Sign into AWS Route53 in the AWS Console
- Navigate to the Hosted zone for the domain
- Click `Create record`
- Enter the `Record name`
- Record type is `A` and toggle `Alias` checkbox on
- Select `Alias to API Gateway`
- Select the region
- Select the API (should be the same value as the domain generated in Step 2)
- Click `Create records`

## Conclusion

Now we're done! You can check to see if your domains are online with this [DNS Checker tool](https://dnschecker.org/).
