---
title: '@domain'
description: Assign a domain name to your app (ACM, API Gateway, and Route 53)
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

### Give your Architect application a proper domain name

DNS is how you assign a domain name to a deployed app. This guide lists ways to set up custom DNS with several popular DNS providers and we are always happy to accept contributions for steps to use additional providers.

## Syntax

`@domain` Assign a domain name to your app (ACM, API Gateway, and Route 53)

First add  to your `@domain` to your `app.arc` file with a value of the domain name you wish to set up. 

## Example

```bash
@app
testapp

@domain
doesbrianlerouxusepromisesyet.com

@http
get /
```

> Read our guide "[`Assigning a domain name to your app`](/en/guides/tutorials/assigning-a-domain-name-to-your-app)" to learn more in depth about setting up DNS for your app.