---
title: Contributor guide
category: About
description: How to contribute to Architect.
---

Architect is an open source project and you can totally help out! Contributing doesn't just mean landing code. It can be reporting bugs, helping us triage bugs, suggesting new features, writing docs, sharing examples, and plain kicking it in our community chat. These are all helpful contributions!


## Helping out

We are always happy to review and potentially accept pull request to Architect repositories. In general, we suggest opening an issue and starting a discussion in the [Discord](https://discord.gg/y5A2eTsCRX) before you embark on any large project, as there may be requirements or considerations that you may not be aware of in advance.

If you have a larger problem to solve or idea for a new feature, please file an issue for community discussion. If you have a time-sensitive problem and need to talk things through, you can almost always find someone online in our [Discord](https://discord.gg/y5A2eTsCRX). (It's also a great place to socialize new ideas and to solicit help on how to model specific [Functional Web App (FWA)](https://fwa.dev) patterns.)

Please help us by making it easy for us to help you! If you are experiencing a bug, please have a reduced test case and steps to reproduce prepared. In our process, the first step to resolution is to create a failing test case so we can ensure there are no future regressions. By having a reduced case (even just an example project) and steps to reproduce, you will dramatically reduce the time to getting your bug fixed.


## Agreement to the Architect Code of Conduct

By participating in and contributing to the Architect community — including, but not limited to its open source projects, any related online venues such as GitHub, Discord, and in-person events, etc. — you agree to the Architect Code of Conduct.

Lack of familiarity with this Code of Conduct is not an excuse for not adhering to it.


## Project structure

The Architect project distribution code is bundled in [`@architect/architect`](https://github.com/architect/architect) which also serves as the [primary project issue tracker](https://github.com/architect/architect/issues).

The Architect project is comprised of multiple core repositories:

- [`@architect/create`](https://github.com/architect/create) - scaffold and generate project code
- [`@architect/deploy`](https://github.com/architect/deploy) - deploy an Architect project
- [`@architect/destroy`](https://github.com/architect/destroy) - destroy an Architect app and its related resources
- [`@architect/env`](https://github.com/architect/env) - read / write project environment variables
- [`@architect/hydrate`](https://github.com/architect/hydrate) - ensures Lambda dependencies are installed and ready for use in an AWS environment
- [`@architect/inventory`](https://github.com/architect/inventory) - enumerate an Architect project (including plugin-generated resources) into a common internal intermediary format
- [`@architect/logs`](https://github.com/architect/logs) - read/write Lambda logs
- [`@architect/package`](https://github.com/architect/package) - consumes an Inventory object, and outputs a CloudFormation document for deployment
- [`@architect/parser`](https://github.com/architect/parser) - parser/lexer for Architect project manifest formats (`app.arc`, `.arc`, `arc.json`, `arc.yaml`, and `arc.yml`)
- [`@architect/sandbox`](https://github.com/architect/sandbox) - local development environment; mocks API Gateway, SNS, SQS, DynamoDB, Lambda, etc.
- [`@architect/utils`](https://github.com/architect/utils) - various shared internal helpers and utilities


Projects built with Architect are encouraged to use the following runtime helper libraries:

- [`@architect/functions`](https://github.com/architect/functions) - Lambda runtime helpers for Node.js
- [`architect/functions-python`](https://github.com/architect/functions-python) - Lambda runtime helpers for Python
- [`architect/functions-ruby`](https://github.com/architect/functions-ruby) - Lambda runtime helpers for Ruby

> Note: runtime helpers are not required to use Architect; they do make dealing with AWS nicer however


It is also worthwhile to take a look at Architect's various supported plugins and example repos:

- [`architect/plugins`](https://github.com/architect/plugins) - officially supported plugins for Architect 10+
- [`architect-examples`](https://github.com/architect-examples) - example Architect apps and projects


## Architect releases

- Architect and its constituent libraries follow [SemVer](https://SemVer.org/), taking into consideration [author-time, deploy-time, and runtime lifecycle stages](https://github.com/architect/architect/issues/938)
- Architect (`@architect/architect`) releases are as deterministic as the `package.json` format allows; this is enforced by the following build dependency requirements:
  - All first-order `@architect/architect` dependencies are version-pinned
  - All second order `@architect/*` dependencies must use SemVer `~`
  - The above versioning (pinning + `~`) do not apply to `devDependencies`


### Creating an Architect release

Architect releases are published via CI / CD, with a degree of manual input. The process for creating a new Architect release looks like this:

1. In the project to be changed, open a PR
  - Ensure test coverage is maintained or added, and that tests pass (of course)
  - Ideally: verify your changes locally before asking others to review your work. Sometimes the fastest path to doing this is simply to monkey-patch your local Architect installation
  - If you're updating any dependencies, make sure `aws-sdk` remains pinned to the same version as all the other Architect libraries are currently using; this is intended to keep it in sync with the [current JS SDK version included in Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
2. If the PR is in good shape and approved by a maintainer, merge the PR to `main`
3. Make sure the `changelog.md` file is updated with the correct version, date, and description of changes
4. Use **`npm version`** to publish a new version (from `main`)
   - Tip: make sure you push the git tag created by `npm version` (e.g. `git push && git push --tags`), or the release will not publish to npm
5. Once the build is complete and the new release of your module is live, if necessary, update any other Architect modules that consume this change
   - Example: if you publish a new minor or major release of `@architect/package`, you will then have to update `@architect/deploy` to use that new dependency, and publish a new version of that package as well
6. Once all the impacted modules are published, prepare a release of `@architect/architect`
   - Bump the changed versions in `@architect/architect`
   - Make sure the main Architect `changelog.md` incorporates all the various changelog changes
   - Ship the new version of Architect (see: step 4)


### Architect module release order

Due to internal module dependencies, Architect has the following module release order:

0. `parser`
1. `asap` + `utils`
2. `inventory`
3. `create` + `package` + `hydrate` + `destroy` + `env` + `logs` + `functions`
4. `sandbox` + `deploy`
5. `@architect/architect`

Per this module release, should you make a SemVer major or minor change in any of the packages earlier the list, many (or possibly all) packages below it will need to be updated and re-published.

Examples:

- If you make a SemVer major or minor change to `hydrate`, you will have to consume that change in `sandbox` and `deploy` before publishing `@architect/architect`
- If you make a SemVer major or minor change to `inventory`, you will have to consume that change in all packages in order stages 3, then 4, before publishing `@architect/architect`


### Non-reliance on automation for some release processes

While some projects opt for highly automated module publishing and changelog / release notes, Architect has thus far been successful by utilizing a tight and reliable, albeit more manual, deployment process.

For example, our release notes are written in plain, highly readable and explanatory language (as opposed to in commit message format).

Of course, we are always open to streamlining our processes, so please feel free to suggest improvements.
