---
title: "Start here: custom domains"
description: Setting up a domain name with Route 53
sections:
  - Overview
  - DNS guides
  - Setting up your project
---

## Overview

### Give your Architect application a proper domain name.

DNS is how you assign a domain name to a deployed app. This guide lists ways to set up custom DNS with several popular DNS providers and we are always happy to accept contributions for steps to use additional providers.

You may use a free registrar-based DNS to host your domain on Begin such as Godaddy, Namecheap, One, etc., but Route53 is the preferred registrar and DNS management system for Architect users. This is because:

- It's integrated with Amazon's other cloud services.
- Your DNS will resolve from 15+ locations worldwide, making your website faster for your end-users.
- Route53 is a DNS management system (Smart DNS) compared to all the others, which are merely domain registrars with a limited feature set for manipulating DNS.

## Setting up your project

To prepare your arc app for setting up a custom domain, you first have to deploy your app to `staging` and `production`.

Deploy to a `staging` stack:

```bash
arc deploy
```
> Protip: create additional `staging` stacks with `--name`

Ship a `production` stack:

```bash
arc deploy production
```

All done!

> Remember to save the two generated `URLs` because we will need to input these into the AWS console in the next steps.

## DNS guides

Setting up a custom domain for each registrar will be a bit different. To manually configure DNS, you can follow these guides below:

- [Route 53](/docs/en/guides/domains/route-53)
- [Cloudflare](/docs/en/guides/domains/cloudflare)
- [Dreamhost](/docs/en/guides/domains/dreamhost)
- [Godaddy](/docs/en/guides/domains/godaddy)
- [One](/docs/en/guides/domains/one)
- [Namecheap](/docs/en/guides/domains/namecheap)