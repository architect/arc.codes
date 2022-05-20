---
title: Using Deno
category: Developer Experience
description: Deno runtime support
---

The Architect team has a strong interest in [Deno](https://deno.land/) as a runtime. Architect provides experimental support for Deno via a [Lambda _layer_](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-concepts.html#gettingstarted-concepts-layer).

## Current support

Deno is not currently an officially supported AWS Lambda runtime, but Architect adds a Lambda _layer_ to provide the Deno executable on AWS infrastructure.  
Additionally, [Sandbox](../../reference/cli/sandbox) will use `deno` to invoke functions while developing locally.

> ⚠️  Lambda layers can increase response times when the function is cold. This approach to enabling Deno is not ideal for user interaction.

### Project configuration

Set the Deno runtime in your [project (`app.arc`)](../../reference/project-manifest/aws) or [function (`config.arc`)](../../reference/configuration/function-config) configuration:

```arc
@aws
runtime deno
```

This setting will enable Deno in your project (or a single function), allowing handlers to be written in TypeScript or JavaScript and run with Deno:

```typescript
// src/http/get-index/index.ts
export async function handler() {
  const myUUID = crypto.randomUUID();
  const resp = await fetch('https://api.github.com/users/architect');
  const arcGitHub = await resp.json();

  return {
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf8' },
    body: `
      <p>🎲 ${myUUID}</p>
      <p>🦖 ${Deno.version.deno}</p>
      <p><pre>${JSON.stringify(arcGitHub, null, 2)}</pre></p>
    `,
  };
}
```

> 🦕  To enable Sandbox support for Deno, make sure you [install Deno locally](https://deno.land/#installation).

Architect and Sandbox will still run with Node.js, but will orchestrate `deno` processes when running your functions.

<!--
### Dependency management
-->

### Deno runtime version

The current provided layer is Deno v1.19.1.

> 🧑‍🔬  The Arc team is actively working on providing up-to-date and configurable Deno layers.
