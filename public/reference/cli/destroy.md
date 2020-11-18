# `arc destroy`

Destroy a previously-[deployed](/reference/cli/deploy) architect app environment.
By default, the `staging` environment of your app is destroyed.

Available options for this command are:

- `--name`: the name of your app. This parameter is required and the command
    will fail if not provided.
- `--force`: will also destroy any persisted data that was deployed for your
    application. Specifically, this will destroy any AWS S3 buckets or AWS
    DynamoDB tables created for your application.
- `--production`: will destroy the `production` environment of your app. By
    default, the `staging` environment is destroyed.

---
