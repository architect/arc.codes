---
title: logs
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - Installation
  - Usage
  - Flags
---

## Overview

[@architect/logs] is a module that retrieves and clears logs associated to your @architect functions across environments.

## Installation

```js
npm i @architect/logs
let logs = require('@architect/logs')
```

## Usage

`arc logs` methods display or clear logs for a given function inside of your project. Perfect for debugging.

- To show `staging` logs run `arc logs src/http/get-index`
- To show `production` logs run `arc logs production src/http/get-index`
- To clear `staging` logs run `arc logs nuke src/http/get-index`
- To clear `production` logs run `arc logs nuke production src/http/get-index`

## Flags

`[-v, --verbose, verbose]`
`[-n, --nuke, nuke]`
`[-p, --production, production, prod]`

