# Install

Open up a terminal and create a project folder:

```bash
mkdir mytestapp
cd mytestapp
npm init --yes
npm install @smallwins/arc-create @smallwins/arc-deploy --save
touch .arc
```

Add the following to `scripts` in the `package.json`:

```javascript
// don't forget to setup your AWS_PROFILE
{
  "create": "AWS_PROFILE=xxx AWS_REGION=us-west-1 arc-create",
  "deploy": "AWS_PROFILE=xxx AWS_REGION=us-west-1 arc-deploy"
}
```

And then paste the following contents into the `.arc` file:

```arc
@app
testapp

@html
get /

@json
get /api
```

Run `npm run create` and check out the freshly deployed app. You have successfully *"installed"* arc!

## Next Steps

- Get a sense of the [project layout](/quickstart/arc-project-layout).
