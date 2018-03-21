# Sync Deps

> Shared deps is necessary and having them go out of sync is an error prone condition. Recommendation: out-of-date dependencies is a failing test!

You cannot opt-out of shared dependencies in an `.arc` project. There are many use cases for isolating code into shared modules:

- Separating your data layer from your app is darn good idea
- Common view templates
- Shared content: translations, error codes, etc

And having lots of deps means having to manage lots of versions of packages:

- `node_modules` in `.src` defined by `.arc`
- `node_modules` in `.src` *not* defined by `.arc`
- `node_modules` in the root for `./test` (the parent or the monorepo root or whatever)

Two things can happen: you can synchronize them all or you can let the drift. Just writing that down seemed completely silly but we did try the former and suffice to say your initial gut reaction was correct: it was not awesome. Precisely the opposite. I get it, microservices can be independent and this type of project sure feels like it can get away with that. The functions are completely isolated when deployed. However an `.arc` file *always* defines an `@app` namespace that **within that** all of your dependencies should be synchronized or you will eventually run into hard to trace bugs due to inconsistencies.

The great news is there is an easy solution. Keep your modules in sync and ensure they stay that way by writing a failing test if they are not at the most recent published version. You *could* version lock but then you're opening yourself up bugs due to staleness.

Here is a hideous (but working!) dep checker tester for everything in `./src/json`.

```javascript
var test = require('tape')
var path = require('path')
var analyze = require('analyze-deps')
var glob = require('glob')
var tests = glob.sync(path.join(process.cwd(), 'src', 'json', '*'))

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
- For deps defined by `.arc` you can use [`@architect/modules`](/reference/npm-run-scripts#arc-modules) `npm run` scripts

More complex projects will have unique build requirements which you can compose with Node or Bash as you see fit. We recommend a `./scripts` folder for those particulars.
