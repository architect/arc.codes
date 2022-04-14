---
title: Deploying from GitHub Actions
category: Continuous integration
description: Deploy an Architect project from GitHub Actions.
---

Deploy an Architect project from GitHub Actions. This particular example (inspired by [the Remix team's implementation](https://github.com/remix-run/grunge-stack/blob/bc9270eb29eda1a806d6b4c773ebcf84f216e2ab/.github/workflows/deploy.yml)) will deploy commits to the `dev` branch to staging and commits to `main` to production. Extract or add steps as needed for your pipeline.

Set up this action by adding to your project's repository in `./.github/workflows/deploy.yml`.

> 🔑  Required: Set your project's `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in [your GitHub repository's secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).  
<!-- Alternatively, your GitHub Action can [gather keys from a specific AWS IAM Role federated by an IAM OIDCProvider](./github-actions-iam-oidcp). -->

## Action YAML template

```yaml
name: Deploy
on:
  push:
    branches:
      - main
      - dev
  pull_request: {}

defaults:
  run:
    shell: bash

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - name: Cancel previous runs
        uses: styfle/cancel-workflow-action@0.9.1
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        uses: bahmutov/npm-install@v1
      # - name: Build
      #   run: npm run build
      - name: Run tests
        run: npm test

  deploy:
    needs: [test]
    runs-on: ubuntu-latest
    steps:
      - name: Cancel previous uns
        uses: styfle/cancel-workflow-action@0.9.1
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
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
      # - name: Build
      #   run: npm run build
      - name: Staging deploy
        if: github.ref == 'refs/heads/dev'
        run: arc deploy --staging -v --prune
        env:
          CI: true
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      - name: Production deploy
        if: github.ref == 'refs/heads/main'
        run: arc deploy --production -v --prune
        env:
          CI: true
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
