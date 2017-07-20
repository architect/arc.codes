# Project Layout

`architect` projects make use of `npm run` scripts to read and execute workflows against a `.arc` file. 

- `arc-create` creates lambda code locally in `./src` for each respective `.arc` declaration
- `arc-deploy` deploys lambda code defined in `.arc` to `staging` and, with an additional manual step, `production`

Given the following `.arc` file:

```arc
@app
testapp

@events
hello

@html
get /

@json
get /posts
```

Running `npm run create` creates the following code:

```bash
/
|-src
| |-events
| | '-hello/
| |-html
| | '-get-index/
| '-json
|   '-get-posts/
|-.arc
'-package.json
```

The generated code was also immediately deployed. Subsequent edits to the local code is deployed by running `npm run deploy`. Happy with `staging`? Ship a release to `production` by running `ARC_DEPLOY=production npm run deploy`. 

Time to celebrate! &#x26c5; 

## Next steps

- Read up on how lambda functions are authored in the [reference](/reference). 
- Skip the reference and check out code [examples](/examples).
