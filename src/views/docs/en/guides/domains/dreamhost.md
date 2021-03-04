---
title: Dreamhost
description: Setting up a domain name with Dreamhost
---

## Prerequisites 

- Sign up for a domain on [Dreamhost](https://www.dreamhost.com/domains/)
- Deploy an app with Architect and make note of the `staging` and `production` URLs

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