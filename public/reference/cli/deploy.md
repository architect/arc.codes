# `arc deploy`
## Deploy code to staging

Deploys code in `src` with CloudFormation and `public` by directly uploading files to S3.

- `arc deploy`
- `arc deploy dirty`
- `arc deploy production`
- `arc deploy static`

Additional considerations:

- If `package.json`, `requirements.txt` or `Gemfile` are found deps will be installed
- Copies `src/shared` and `src/views`
---
