---
title: logs
description: A module that retrieves and clears logs associated to your @architect functions across environments.
sections:
  - Overview
  - Installation
  - Usage
  - Flags
---

## Overview

[`@architect/logs`](https://github.com/architect/logs) is a module that retrieves and clears logs associated to your @architect functions across environments.

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

## API

### `logs({pathToCode, verbose, nuke, production}, callback)`

Takes a parameter object as first argument which accepts the following properties:

- `pathToCode`: **required** the local path to architect Function code relative
    to the current working directory, i.e. `src/http/get-index`
- `verbose`: verbose super chatty mode
- `nuke`: if truthy will delete logs via [`logs.nuke`][nuke], otherwise will
    read logs via [`logs.read`][read]
- `production`: if truthy will target your arc project's production environment,
    otherwise will default to staging

By default will [read][read] logs from the staging environment. If the `nuke`
property is truthy, logs instead will be [nuked][nuke].

### `logs.read({name, pathToCode, ts}, callback)`

Will read logs from [`aws.CloudWatchLogs`][cloudwatchlogs], invoking
[`getLogEvents`][getlogevents] for log retrieval.

Takes a parameter object as first argument which accepts the following properties:

- `name`: the CloudFormation `StackName` passed to
    [`listStackResources`][liststack] within which to search Function logs. Note
    that this is inferred from your application name, environment and specific
    function you are querying - tread carefully!
- `pathToCode`: **required** the local path to architect Function code relative
    to the current working directory, i.e. `src/http/get-index`
- `ts`: timestamp to use as a start time for displaying length of time details
    (i.e. `Date.now()`)

`callback` will be invoked with an error if an error arises during execution.
Otherwise, `callback` will be invoked without arguments.

### `logs.nuke({name, pathToCode, ts}, callback)`

Will delete logs from [`aws.CloudWatchLogs`][cloudwatchlogs], invoking
[`deleteLogGroup`][deleteloggroup].

Takes a parameter object as first argument which accepts the following properties:

- `name`: the CloudFormation `StackName` passed to
    [`listStackResources`][liststack] within which to search Function logs. Note
    that this is inferred from your application name, environment and specific
    function you are querying - tread carefully!
- `pathToCode`: **required** the local path to architect Function code relative
    to the current working directory, i.e. `src/http/get-index`
- `ts`: timestamp to use as a start time for displaying length of time details
    (i.e. `Date.now()`)

`callback` will be invoked with an error if an error arises during execution.
Otherwise, `callback` will be invoked without arguments.

## Flags

`[-v, --verbose, verbose]`
`[-n, --nuke, nuke]`
`[-p, --production, production, prod]`

