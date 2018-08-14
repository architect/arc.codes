<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

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

## Next: [.arc project layout](/quickstart/arc-project-layout)
