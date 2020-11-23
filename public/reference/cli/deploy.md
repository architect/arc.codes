# `arc deploy`
## Deploy code to staging

Deploys code in `src` with CloudFormation and `public` by directly uploading files to S3.

- `arc deploy` deploys to a staging stack
- `arc deploy --direct [--production]` overwrites Lambda source with local source – fast, and very useful for short-term debugging and testing live patches
- `arc deploy --production` deploys to a production stack
- `arc deploy --static` deploys static assets only

Additional considerations:

- If `package.json`, `requirements.txt` or `Gemfile` are found deps will be installed
- Copies `src/shared` and `src/views`

---
