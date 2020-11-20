---
title: '@proxy'
description: Pragma to declare your app namespace
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

With @proxy, any HTTP requests that miss an `@http` route are automatically forwarded to your existing site or API. 

## Syntax

- Use the word `production` followed by a link to your desired API URL.

## Example

For example, say you have an existing API at `https://apiurl/v1`. With `@proxy`, you can run a parallel `v2` endpoint from a fresh Architect app like so:

```bash
@http
get /v2/*
post /v2/*

@proxy
production https://apiurl
```

With the above Architect file, your new app will respond to all get and post requests to `/v2/*`, and forward along requests to `/v1` to your existing API.