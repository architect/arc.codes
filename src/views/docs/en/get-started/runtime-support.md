---
title: Architect runtime support
category: Getting started
description: Architect runtime support documentation
---

## Overview

This document outlines the current runtime support commitments Architect makes, both for official AWS Lambda runtimes (such as Node.js), and Architect-specific runtimes (such as TypeScript and Deno).


## Runtime support definitions

### Deployment

Architect will deploy your function to AWS. Caveats:
- If you are using a compiled language, such as .NET, you may be responsible for compiling your own handlers via custom scripts or [Architect plugins](/docs/en/guides/plugins/overview); however, once compiled, [Deploy](/docs/en/reference/cli/deploy) will ship your code.
- Some runtimes may be supported by way of an Architect runtime plugin. For example, Architect supports Rust via its [official Rust plugin](https://github.com/architect/plugin-rust).


### Sandbox

Architect's local development environment, [Sandbox](/docs/en/reference/cli/sandbox), will execute your code locally in a fully-emulated Lambda. This may also include support for automatically compiling / transpiling handlers via plugin.


### Runtime utils

Architect authors and maintains a runtime utility library, such as [`@architect/functions`](/docs/en/reference/runtime-helpers/node.js) (Node.js) or [`architect-functions`](/docs/en/reference/runtime-helpers/python) (Python), with helpers for various Architect primitives (`@http` events, etc.), service discovery support, and more.


### Automated dependency management

Architect [Deploy](/docs/en/reference/cli/deploy) (via [Hydrate](/docs/en/reference/cli/hydrate)) can be relied upon to automatically install each handler's unique dependency tree without any manual management of per-handler dependency manifests (e.g. `src/http/get-index/package.json|requirements.txt`, etc.).


## Runtime support matrix

Runtime     | [Deployment][1] | [Sandbox][2]  | [Runtime utils][3]  | [Automated dependency management][4]  |
------------|-----------------|---------------|---------------------|---------------------------------------|
Node.js     | **✓**           | **✓**         | [**✓**][5]          | **✓**
TypeScript¹ | **✓**           | **✓**         | [**✓**][5]          | **✓**
Python      | **✓**           | **✓**         | [**✓**][6]          | **✓**
Deno²       | **✓**           | **✓**         | [~²][7]             |
Ruby        | **✓**           | **✓**         |                     |
Rust³       | **✓**           | **✓**         |                     |
Go⁴         | **✓**           | **✓**         |                     |
Java        | **✓**           | &             |                     |
.NET        | **✓**           | &             |                     |
Custom      | &               | &             |                     |

Legend:
- `✓` full support
- `~` partial support
- `&` planned support


¹ TypeScript supported via [official plugin](https://github.com/architect/plugin-typescript)

² Deno support may not be current or stable due to ongoing issues related to [Deno compiling to AWS Linux](https://github.com/denoland/deno/issues/17925); an [in-development Deno utility library can be found here](https://github.com/architect/functions-deno)

³ Rust supported via [official plugin](https://github.com/architect/plugin-rust)

⁴ Go supported via [official plugin](https://github.com/architect/plugin-go)

[1]: #deployment
[2]: #sandbox
[3]: #runtime-utils
[4]: #automated-dependency-management
[5]: /docs/en/reference/runtime-helpers/node.js
[6]: /docs/en/reference/runtime-helpers/python
[7]: /docs/en/reference/runtime-helpers/deno
