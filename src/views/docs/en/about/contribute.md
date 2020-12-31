---
title: Contributor guide
category: about
description: How to contribute to Architect.
---

Architect is an open source project and you can totally help out! Contributing doesn't just mean landing code. It can be reporting bugs, helping us triage bugs, suggesting new features, writing docs, sharing examples and plain kicking it in our community chat. These are all helpful contributions!

## Agreement to the Architect Code of Conduct

By participating in and contributing to the Architect community — including, but not limited to its open source projects, any related online venues such as GitHub, Slack, and in-person events, etc. — you agree to the Architect Code of Conduct.

Lack of familiarity with this Code of Conduct is not an excuse for not adhering to it.

## Project Code Structure

The Architect project distribution code is bundled in [`architect/architect`](https://github.com/architect/architect) which also serves as the [primary project issue tracker](https://github.com/architect/architect/issues).

The Architect project is composed of multiple core code repositories on GitHub:

- [`architect/parser`](https://github.com/architect/parser) - parser/lexer for arcfile formats (`.arc`, `app.arc`, `arc.json`, `arc.yaml`, `arc.yml` and `arc.toml`)
- [`architect/package`](https://github.com/architect/package) - a pure function that consumes `architect/parser` output and returns a CloudFormation document
- [`architect/deploy`](https://github.com/architect/deploy) - a wrapper for the AWS CLI `package` and `deploy` commands
- [`architect/sandbox`](https://github.com/architect/sandbox) - the local sandbox (mocks API Gateway, SNS, SQS, DynamoDB, and Lambda)
- [`architect/env`](https://github.com/architect/env) - read/write arcfile project environment variables with SSM
- [`architect/hydrate`](https://github.com/architect/hydrate) - ensures function deps are synced (including src/shared and src/views)
- [`architect/logs`](https://github.com/architect/logs) - read/write function CloudWatch logs
- [`architect/create`](https://github.com/architect/create) - code generation

Projects built with Architect are encouraged to use the following runtime helper libraries:

- [`architect/functions`](https://github.com/architect/functions) - runtime helpers for NodeJS
- [`architect/functions-python`](https://github.com/architect/functions-python) - runtime helpers for Python
- [`architect/functions-ruby`](https://github.com/architect/functions-ruby) - runtime helpers for Ruby

> Note: runtime helpers are not required to use Architect; they do make dealing with AWS nicer however

Architect project documentation is in the following repos:

- architect/arc.codes.next - new docs site in progress (version 6+)
- architect/arc.codes - the primary documentation website (version 6)
- architect/v5.arc.codes - version 5 docs site

## Helping out

We are always happy to accept a pull request to any of the repositories above. If you have a larger problem to solve or idea for a new feature please file an issue for community discussion. If you're having a time sensitive problem and need to talk things through you can almost always find someone in our community chat. It's also a great place to socialize new ideas and to solicit help on how to model specific serverless patterns.

Please help us by making it easy for us to help you! If you are experiencing a bug, please, have a reduced test case and steps to reproduce prepared. In our process, the first step to resolution is to create a failing test case so we can be sure there are no future regressions. By having a reduced case, even just an example project, and steps to reproduce you will save us all time getting to the fix!
