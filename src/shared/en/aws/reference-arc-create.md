# `npm run create`

Reads `.arc` and generates AWS infrastructure if it does not already exist. This command is intended to be run and re-run as you develop your app and modify the corresponding `.arc` file.

> Note: This method can throw errors related to AWS account throttling – if this happens, don't be alarmed! Just wait a few seconds are re-run the command.

To use `npm run create`, add the following to your project's `package.json` scripts:

```json
{
  "scripts": {
    "create": "AWS_PROFILE={profile} AWS_REGION={region} arc-create"
  }
}
```

> Reminder: All `arc` npm run scripts require `AWS_PROFILE` and `AWS_REGION` environment variables set. Learn more in the [Prerequisites guide](/quickstart).

<!-- 
Coming soon / @todo: ARC_LOCAL flag
- Activates with any value
- If present, code is generated locally *only*
- Breaks with @events
 -->
 