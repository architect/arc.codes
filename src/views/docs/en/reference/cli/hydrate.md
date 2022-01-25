---
title: hydrate
category: CLI
description: Install and update dependencies for all functions in a project.
---

Ensure that all functions managed by Architect have their dependencies installed. Functions containing all its required dependencies are considered to be "hydrated" - thus the name!

Importantly, `arc hydrate` will also copy shared code (from `src/shared` and `src/views`) into all functions.

When developing locally with Sandbox, it is not necessary to manually run `hydrate` since Sandbox handles this automatically. However, it can be helpful to ensure hydration happens prior to a process like `npm test`.

## Usage

```bash
arc hydrate [install|--s|--shared|-u|--update|-v|--verbose]
```

## Flags

- `install` - Optional. default command
- `-s`, `--shared`, `shared` - Hydrates and copies shared files only
- `-u`, `--update`, `update` - Updates each function's dependencies
- `-v`, `--verbose`, `verbose` - Prints additional output to the console

## Notes

> ⚠️  This operation can take time to complete depending on how many Lambdas you have and how many modules they require.

Hydrate uses the following commands under the hood, depending on project's or function's runtime:

- **node.js**: `npm ci`
- **python**: `pip3 install`
- **ruby**: `bundle install`

`arc hydrate --update` is almost functionally identical to `arc hydrate`, except it will update dependencies to newer versions _if they exist_. This is done via:

- **node.js**: `npm update`
- **python**: `pip3 install -U --upgrade-strategy eager`
- **ruby**: `bundle update`
