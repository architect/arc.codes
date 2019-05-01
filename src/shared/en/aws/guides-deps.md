# Dependencies

> Shared dependencies are necessary and having them go out of sync is an error-prone condition. Recommendation: make out-of-date dependencies a failing test!

Module dependencies in an `.arc` project are defined in two places:

1. The root project `/package.json`
2. The Lambda function code in `/src/**/*/package.json`

Every time you run `npx deploy` node modules are automatically installed into the Lambdas before deployment using the Lambda `package.json`. If you wish to add more node modules you need to manually run `npm i modulename` **from within the Lambda directory**.


## Bootstrapping an `.arc` project

Starting from a fresh checkout you won't have any dependencies installed. `npm i` will install root node modules. `npx hydrate` runs `npm i` within all the Lambda functions.

```bash
npm i 
npx hydrate
```

Run the project locally with `npx sandbox`.


## Updating a `.arc` project

`npx hydrate update` will update node modules in the Lambda functions. If you need to upgrade breaking changes you will need to manually `cd` into the Lambda directory and run `npm rm modulename && npm i modulename` to get the latest version. 


## Best Practices

- Check in `package.json` and `package-lock.json`
- Also make sure every Lambda has a `package.json` and `package-lock.json` checked in
- Add `node_modules` to your `.gitignore`
- Ensure your dependencies are synchronized within an `@app` namespace

More complex projects will have unique build requirements which you can compose as you see fit. We recommend a `./scripts` folder for those particulars.

---

## Next: [Upgrade Guide](/guides/upgrade)
