# &#x1f329; architect

> provision and deploy cloud architecture as text

Currently supporting Amazon Web Services:

- Lambda
- API Gateway
- DynamoDB
- SNS

Everything you do with `architect` starts with an `.arc` file:

```arc
# this is an .arc file
@app

@html
get /
get /hellos
post /hello

@css
style.css

@js
index.js
```

Running `npm run create` generates cloud function code:

```bash
/
|-src
| |-html
| | |-get-index/
| | |-get-hellos/
| | '-post-hello/
| |-css
| | '-style-css/
| '-js
|   '-index-js/
|-.arc
'-package.json

```

And `npm run deploy` ships this code to the cloud. <span class=cloud>&#x1f329;</span>

### Infra Primitives Currently Supported

- HTTP route handler functions for `application/json`, `text/html`, `text/css` and `text/javascript`
- Subscribe functions to events (and publish events from any other function)
- Scheduled functions 
- Database tables, indexes and trigger functions

### Workflows Currently Supported

- **Create infra** from an `.arc` manifest (makes deletion and re-creation of infrastructure trivial; change regions in minutes)
- **Work locally** while completely offline [IN PROGRESS] (including in memory dynamo instance so its super fast--h/t dynalite!)
- **Deploy in seconds** (setup with `staging` and `production` using a proper environment variable `NODE_ENV`)
 
## Next Steps

- [Read the introduction](/intro)
- [Follow the quickstart](/quickstart)
- [Read the reference](/reference)
- [Copy/paste examples](/examples)
