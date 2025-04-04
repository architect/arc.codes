---
title: arc init
category: CLI
description: Scaffold new resources found in the app.arc file
---

Bootstrap new Architect project code. Running `arc init` in an empty directory creates a default [`app.arc` manifest file][manifest] named after that directory with one default [`@http` function][http] at `src/http/get-index`. Pass a directory name as a final positional argument to create a project in the specified directory. Edit `app.arc`, expanding the [manifest][manifest], adding functions and re-running `arc init` to generate further code. This command is idempotent: intended to be run and re-run; it will only generate files if they do not already exist.

If you run this command with the `--plugin` flag, a scaffolded [Architect plugin][plugins] will be created instead.

## Usage

```bash
arc init [flags] [path/to/project-directory]
```

## Flags

- `-n`, `--name`: Set the [`@app` namespace][app] for the created app
- `--no-install`: Do not automatically install `@architect/architect` as a dependency in the project
- `-p`, `--plugin`: Create a new scaffolded [Architect plugin][plugins] instead of a new Architect project
- `--runtime`, `-r`: Create a new project with the specified runtime. Defaults to `node`. See the [`runtime` configuration documentation][runtimes] for available options.
- `--verbose`, `-v`: Even more output

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

[app]: ../project-manifest/app
[http]: ../project-manifest/http
[manifest]: ../../get-started/project-manifest
[plugins]: ../../guides/plugins/overview
[runtimes]: ../project-manifest/aws#runtime
