# `npm run dns`

Wizard that reads `@domain` from `.arc` and points it to the current app. Some verification and post-run instructions may be required after running.

Please refer to the [Assigning a Domain Name guide](/guides/custom-dns) for additional information and instructions.

To use `npm run dns`, add the following to your project's `package.json` scripts:

```json
{
  "scripts": {
    "dns": "AWS_PROFILE={profile} AWS_REGION={region} arc-dns"
  }
}
```

> Reminder: All `arc` npm run scripts require `AWS_PROFILE` and `AWS_REGION` environment variables set. Learn more in the [Prerequisites guide](/quickstart).
