---
title: Deploying from GitLab Pipelines
category: Continuous integration
description: Deploy an Architect project from GitLab Pipelines.
---

Architect projects can be tested and deployed from GitLab Pipelines.

## Custom pipeline sample

The following example uses a standard pattern where commits to the `main` branch are deployed to a staging environment and git tags that begin with `v` are deployed to production.

This enables a workflow where a pull request can be merged into `main` and automatically promoted to staging. When a git tag is created (like with `npm version patch|minor|major`) the project is deployed to production.  
It is helpful to ["follow tags" when git pushing](https://git-scm.com/docs/git-push#Documentation/git-push.txt---follow-tags).

> 🔑  Required: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` must be set in [your GitLab repository or group variables](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-project).

### Pipeline YAML template

Extract or add steps as needed for your pipeline.

```yaml
# .gitlab-ci.yml
image: node:14-alpine

stages:
  - test
  - deploy

# cache npm across stages
cache:
  key: $CI_COMMIT_REF_SLUG
  paths:
    - .npm/

# run npm install with known cache before each stage
before_script:
  - npm ci --cache .npm --prefer-offline

# build and test
test:
  stage: test
  script:
    - npm run build --if-present
    - arc hydrate
    - npm test

# deploy stages install aws-cli and deploy
.deploy:
  script:
    - apk add --no-cache aws-cli
    - arc deploy --${env} -v --prune

deploy-to-staging:
  stage: deploy
  extends: .deploy
  variables:
    env: staging
  rules:
    # if we're on main branch, deploy to staging
    - if: $CI_COMMIT_BRANCH == 'main'

deploy-to-production:
  stage: deploy
  extends: .deploy
  variables:
    env: production
  rules:
    # if git tag resembles a npm version
    - if: $CI_COMMIT_TAG =~ /^v(?:\d+.){2}(?:\d+)$/
```
