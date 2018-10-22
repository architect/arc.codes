# Dependencies

> Shared deps are necessary and having them go out of sync is an error prone condition. Recommendation: out-of-date dependencies is a failing test!

Module dependencies in an `.arc` project are defined in two places:

1. The root project `/package.json`
2. The lambda function code in `/src/**/*/package.json`

Every time you run `npx deploy` node modules are automatically installed into the lambdas before deployment using the lambda `package.json`. If you wish to add more node modules you need to manually run `npm i modulename` **from within the lambda directory**.


## Bootstrapping an `.arc` project

Starting from a fresh checkout you won't have any dependencies installed. `npm i` will install root node modules. `npx hydrate` runs `npm i` within all the lamda functions.

```bash
npm i 
npx hydrate
```

Run the project locally with `npx sandbox`.


## Updating a `.arc` project

`npx hydrate update` will update node modules in the lambda functions. If you need to upgrade breaking changes you will need to manually `cd` into the lambda directory and run `npm rm modulename && npm i modulename` to get the latest version. 


## Best Practices

- Check in `package.json` and `package-lock.json`
- Also make sure every lambda has a `package.json` and `package-lock.json` checked in
- Add `node_modules` to your `.gitignore`
- Ensure your deps are synchronized within an `@app` namespace

More complex projects will have unique build requirements which you can compose as you see fit. We recommend a `./scripts` folder for those particulars.

<hr>


## Next: [Upgrade Guide](/guides/upgrade)
