# Macros

## Extend `.arc` with standard CloudFormation

The `@macro` primitive defines macros to run in descending order on the generated CloudFormation template before deployment.

---

- <a href=#local><b>🚜 Define</b></a>
- <a href=#deploy><b>⛵️ Deploy</b></a>

---

<h2 id=local>🚜 Define</h2>

An example `.arc` file:

```arc
@app
testapp

@macros
my-custom-macro
```

When running `arc deploy` Architect will look for macros to run in:

- `src/macros/filename`
- `node_modules/macro-module-name`

For this example `.arc` above the macro is in `src/macros/my-custom-macro.js`

```javascript
/**
 * @param {object} arc - the parsed .arc file currently executing
 * @param {object} cloudformation - the current AWS::Serverless CloudFormation template
 * @param {object} stage - the application stage (one of `staging` or `production`)
 */
exports.module = function myCustomMacro(arc, cloudformation, stage) {
  // modify cloudformation.Resources here
  return cloudformation
}
```

Macros receive the parsed `.arc` file so custom pragmas and config can be defined. The second argument is the current CloudFormation template. Macros allow devs to add any resources or modify existing ones extending Architect into the entire AWS ecosystem supported by CloudFormation.

> **Note:** macros are a new feature and only JavaScript macros are supported at this time; however Python and Ruby are planned

---

<h2 id=deploy>⛵️ Deploy</h2>

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy production` to run a full CloudFormation production deployment

---
