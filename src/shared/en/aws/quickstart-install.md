# Installation

Open up a terminal and create a project folder:

```bash
mkdir mytestapp
cd mytestapp
npm init --yes
npm install @architect/workflows
touch .arc
```

And then paste the following contents into the `.arc` file:

```arc
@app
testapp

@html
get /
```

Run `npx create` and check out the freshly deployed app. Congrats, you've successfully setup and deployed a web app! Nice work. 💖

> Caution! If you get the following exception, delete any old endpoints with identical names from API Gateway.

```
putIntegration failed NotFoundException { restApiId: 'kxia35w1j8', resourceId: 'xqvqvpvrp0' }
Error Invalid Method identifier specified
NotFoundException: Invalid Method identifier specified
```

## Next: [.arc project layout](/quickstart/arc-project-layout)
