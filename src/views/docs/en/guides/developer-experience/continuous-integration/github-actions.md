---
title: Deploying from GitHub Actions
category: Continuous integration
description: Deploy an Architect project from GitHub Actions.
---

Architect projects can be tested and deployed from GitHub Actions.

## Architect-provided actions

Architect has created [`architect/action-build`](https://github.com/architect/action-build) and [`architect/action-deploy`](https://github.com/architect/action-deploy) for GitHub Actions. These can be included as a part of your project's workflows.

> 🔑  Required: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` must be set in [your GitHub repository or organization secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

The deploy action follows a standard pattern where commits to the `main` branch are deployed to a staging environment and git tags that begin with `v` are deployed to production.

This enables a workflow where a pull request can be merged into `main` and automatically promoted to staging. When a git tag is created (like with `npm version patch|minor|major`) the project is deployed to production.  
It is helpful to ["follow tags" when git pushing](https://git-scm.com/docs/git-push#Documentation/git-push.txt---follow-tags).

### Usage example

```yaml
# .github/workflows/build-deploy.yml
name: Build and deploy

on: [ push, pull_request ]

jobs:
  # Build and test
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Build App
        uses: architect/action-build@v3

  # Deploy main branch to staging and git tags to production
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest

    steps:
      - name: Deploy app
        uses: architect/action-deploy@v1
        with:
          aws_access_key_id: ${{secrets.AWS_ACCESS_KEY_ID}}
          aws_secret_access_key: ${{secrets.AWS_SECRET_ACCESS_KEY}}
```

## Custom action sample

The following example is similar to the Architect actions but will deploy commits to the `dev` branch to staging and commits to `main` to production. Extract or add steps as needed for your pipeline.

### Action YAML template

```yaml
# ./.github/workflows/test-deploy.yml
name: Test and deploy

on:
  push:
    branches:
      - main
      - dev
  pull_request: {}

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - name: Cancel previous runs
        uses: styfle/cancel-workflow-action@0.11.0
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 14
      - name: Install dependencies
        uses: bahmutov/npm-install@v1
      - name: Arc hydrate
        run: arc hydrate
      - name: Run tests
        run: npm test

  deploy:
    name: Deploy
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Cancel previous runs
        uses: styfle/cancel-workflow-action@0.11.0
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 14
      - name: Env report
        run: |
          echo "Event name: ${{ github.event_name }}"
          echo "Git ref:    ${{ github.ref }}"
          echo "GH actor:   ${{ github.actor }}"
          echo "SHA:        ${{ github.sha }}"
          VER=`node --version`; echo "Node ver:   $VER"
          VER=`npm --version`; echo "npm ver:    $VER"
      - name: Install dependencies
        uses: bahmutov/npm-install@v1
      - name: Arc hydrate
        run: arc hydrate
      - name: Staging deploy
        if: github.ref == 'refs/heads/dev'
        run: arc deploy --staging -v --prune
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      - name: Production deploy
        if: github.ref == 'refs/heads/main'
        run: arc deploy --production -v --prune
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

<!-- 
## Use AWS IAM OIDCProvider

Alternatively, your GitHub Action can [gather keys from a specific AWS IAM Role federated by an IAM OIDCProvider](./github-actions-iam-oidcp).
-->
