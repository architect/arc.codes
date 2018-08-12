# Dependencies

> Shared deps are necessary and having them go out of sync is an error prone condition. Recommendation: out-of-date dependencies is a failing test!

Module dependencies in an `.arc` project are defined in two places:

1. The root project `/package.json`
2. The lambda function code in `/src/**/*/package.json`

Every time you run `npx deploy` node modules are automatically installed into the lambdas before deployment using the lambda `package.json`. If you wish to add more node modules you need to manually run `npm i modulename` **from within the lambda directory**.

## Bootstrapping an `.arc` project

Starting from a fresh checkout you won't have any dependencies installed. `npm i` will install root node modules. `npx hydrate` is an `@architect/workflows` command that runs `npm i` within all the lamda functions.

```bash
npm i 
npx hydrate
```

Now you can run the project locally with `npx sandbox`.

## Updating a `.arc` project

`npx hydrate update` will update node modules in the lambda functions. If you need to upgrade breaking changes you will need to manually `cd` into the lambda directory and run `npm rm modulename && npm i modulename` to get the latest version. 

## Best Practices

- Check in `package.json` and `package-lock.json`
- Also make sure every lambda has a `package.json` and `package-lock.json` checked in
- Add `node_modules` to your `.gitignore`
- Ensure your deps are synchronized within an `@app` namespace

### Sync Deps

An `.arc` file *always* defines an `@app` namespace that **within that namespace** we reccomend all of dependencies should be synchronized or you will eventually run into hard to trace bugs due to inconsistencies.

The great news is there is an easy solution. Keep your modules in sync and ensure they stay that way by writing a failing test if they are not at the most recent published version. You *could* version lock but then you're opening yourself up bugs due to staleness.

Here is a hideous (but working!) dep checker tester for everything in `./src/json`.

```javascript
var test = require('tape')
var path = require('path')
var analyze = require('analyze-deps')
var glob = require('glob')
var tests = glob.sync(path.join(process.cwd(), 'src', 'json', '*')) // NOTE this only looks at src/json/*

tests.forEach(title=> {
  test('ensure ' + title + ' deps at latest', t=> {
    var apiAction = require(title + '/package.json')
    if (apiAction.dependencies) {
      t.plan(Object.keys(apiAction.dependencies).length)
      analyze(apiAction).then(function _analyzed(deps) {
        Object.keys(deps.dependencies).forEach(function _pkg(pkg) {
          if (deps.dependencies[pkg].status === 'not-latest') {
            var latest = 'latest@' + deps.dependencies[pkg].latest
            t.fail(pkg + '@' + deps.dependencies[pkg].current + ' not current; ' + latest)
            console.log(latest)
          }
          else {
            t.ok(true, pkg + ' is current')
          }
        })
      }).catch(function (wat) {
        console.log(wat)
      })
    }
    else {
      t.plan(1)
      t.ok(true, 'no deps')
    }
  })
})
```

> (PR's and ideas here very welcome!)

## Tests Fail: Now What?

Ok, so your deps fell out of date and the build failed.

- Manually change into the shared dep directories and use `npm` normally

More complex projects will have unique build requirements which you can compose with Node or Bash as you see fit. We recommend a `./scripts` folder for those particulars.
