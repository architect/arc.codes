# `arc deploy`
## Deploy code to staging

Deploys code in `src` with CloudFormation and `public` by directly uploading files to S3.

- `arc deploy` deploys to a staging stack
- `arc deploy dirty` overwrites static lambda with local source (fast!)
- `arc deploy production` deploys to a production stack
- `arc deploy static` deploys static assets only

Additional considerations:

- If `package.json`, `requirements.txt` or `Gemfile` are found deps will be installed
- Copies `src/shared` and `src/views`
---
