---
title: init
description: Bootstrapping a new Architect project with folder structures and an app.arc file
sections:
  - Overview
  - Usage
  - Flags
---

## Overview

The `init` command will bootstrap new Architect projects and local folders. It uses the [`@architect/create` module](https://github.com/architect/create).

## Usage

Run `arc init` in an empty directory will create a default `app.arc` manifest file named after that directory with one default function `src/http/get-index`. 

Edit the `app.arc` file to add functions and re-run `arc init` to generate local code. This command is intended to be run and re-run; it will only generate files if they do not already exist.

## Flags

`[-s, --static, static]` - creates a new project with `@static` folder set to `public`
`[-r, --runtime, runtime ]` - create a new project with a specified runtime, options are node, deno, python, or ruby
`[-v, --verbose, verbose]` - outputs extra message during creation

## Example

- `npm init @architect` ......... create project named for current dir in current dir

- `npm init @architect ./` ...... create project named for current dir in current dir

- `npm init @architect foo` ..... create project named `foo` in current dir

- `npm init @architect ./foo` ... create `./foo` dir and project named `foo` that dir

- `npm init @architect ../foo` .. create `../foo` dir and project named `foo` that dir

- `npm init @architect /foo` .... create `/foo` dir, creates project named `foo` that dir

- `npm init @architect ../` ..... create project in .. for named for whatever .. is named