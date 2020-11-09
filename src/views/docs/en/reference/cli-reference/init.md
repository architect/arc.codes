---
title: init
description: Bootstrapping a new Architect project with folder structures and .arc file
sections:
  - Overview
  - Usage
  - Flags
---

## Overview

The `init` command will bootstrap new Architect projects and local folders. It uses the `@architect/create` module.

## Usage

Run `arc init` in an empty directory will create a default `app.arc` manifest file named after that directory with one default function `src/http/get-index`. 

Edit the `app.arc` file to add functions and re-run `arc init` to generate local code. This command is intended to be run and re-run; it will only generate files if they do not already exist.

## Flags

`[-s, --static, static]` - creates a new project with `@static` folder set to `public`
`[-r, --runtime, runtime ]` - create a new project with a specified runtime, options are node, deno, python, or ruby
`[-v, --verbose, verbose]` - outputs extra message during creation
