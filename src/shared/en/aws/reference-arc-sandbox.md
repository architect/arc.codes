# `npm start`

Starts a local web server and in-memory database for previewing code defined by `.arc`.

To use `npm start`, add the following to your project's `package.json` scripts:

```json
{
  "scripts": {
    "start": "AWS_PROFILE={profile} AWS_REGION={region} NODE_ENV=testing arc-sandbox"
  }
}
```

> Reminder: All `arc` npm run scripts require `AWS_PROFILE` and `AWS_REGION` environment variables set. Learn more in the [Prerequisites guide](/quickstart).
