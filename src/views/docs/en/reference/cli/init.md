---
title: arc init
category: CLI
description: Scaffold new resources found in the app.arc file
---

Bootstrap new Architect project code. Running `arc init` in an empty directory creates a default `app.arc` manifest file named after that directory with one default function `src/http/get-index`. Edit `app.arc` adding functions and re-run `arc init` to generate further code. This command is intended to be run and re-run; it will only generate files if they do not already exist.

## Usage

```bash
arc init [--static|--runtime]
```

## Flags

- `[--static, -s]` Create a new project with `@static` folder set to `public`
- `[--runtime, -r]` Create a new project with a specified runtime, options are node, deno, python, or ruby
- `[--verbose, -v]` Even more output

## Local preferences: `@create`

`arc init` can use specified templates when scaffolding new resources. Options are set with [`@create` in local preferences](../configuration/local-preferences#%40create).

- `templates` - Specify templates for automatic resource scaffolding.
  - `<pragma name> path/to/template.ext`

```arc
@create
templates
  http path/to/template/http.js
  events path/to/template/events.py
```

## Examples

### Create a new app

```bash
mkdir myapp
cd myapp
arc init
```

### Create a Node app with Architect installed locally

<arc-viewer default-tab=bash>
<div slot=contents>
<arc-tab label=bash>
<h5>Bash/cmd.exe</h5>
<div slot=content>

```bash
npm init @architect myapp
```
</div>
</arc-tab>

<arc-tab label=PowerShell>
<h5>PowerShell</h5>
<div slot=content>

```powershell
npm init "@architect" myapp
```
</div>
</arc-tab>
</div>
</arc-viewer>
