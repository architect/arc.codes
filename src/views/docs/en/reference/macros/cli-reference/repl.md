---
title: repl
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - Usage
  - Flags
---

## Overview

Architect comes with helpful terminal access to your data in the form of a `repl` feature that lets you perform methods on DynamoDB such as:

- read
- evaluate
- print
- loop 

`repl` lets you use these methods on `@tables` and `@indexes` provisioned in your `.arc` manifest file.

## Usage

- `arc repl` connects to a local in memory representation of `app.arc`
- `arc repl staging` connects to staging tables and indexes
- `arc repl production` connects to production tables and indexes

After the REPL starts type: `data` to see the generated data layer.

