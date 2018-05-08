# Installation

Open up a terminal and create a project folder:

```bash
mkdir mytestapp
cd mytestapp
npm init --yes
npm install @architect/workflows --save
touch .arc
```

Add the following to `scripts` in the `package.json` (with the example [profile name of `work` from your AWS credentials setup](/quickstart) and deploying to the Oregon `us-west-1` region):

```javascript
// don't forget to set up your AWS_PROFILE
{
  "create": "AWS_PROFILE=work AWS_REGION=us-west-1 arc-create",
  "deploy": "AWS_PROFILE=work AWS_REGION=us-west-1 arc-deploy",
  "start": "AWS_PROFILE=work AWS_REGION=us-west-1 NODE_ENV=testing arc-sandbox"
}
```

> If you plan to [assign a domain name](/guides/custom-dns) to your app, you may also want to add the [DNS script](/reference/arc-dns)

And then paste the following contents into the `.arc` file:

```arc
@app
testapp

@html
get /
```

Run `npm run create` and check out the freshly deployed app. Congrats, you've successfully installed `architect`!

## Next: [.arc project layout](/quickstart/arc-project-layout)
