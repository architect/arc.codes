---
title: arc logs
category: CLI
description: Read or clears Lambda function logs.
---

Read or clear Lambda function logs.

## Usage

```bash
arc logs [-n|--nuke|nuke] [production] path/to/code
```

## Examples

### Read logs

```bash
arc logs src/http/get-index
```

### Nuke logs

```bash
arc logs nuke src/http/get-index
```
