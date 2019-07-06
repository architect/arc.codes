# Less But Better
## Deploy powerful **AWS** primitives with clear and readable config 

- 🔥 **Database backed web apps** that scale to zero
- 💖 **Static single page apps** seamlessly integrated with cloud functions
- ⏳ **Long running background tasks** (15min) and scheduled jobs 

Modern apps deserve modern workflows: 

- 💓 **Primitives, not frameworks**: define architecture agnostic of vendor arcana
- 💻 **Work locally** while completely offline with a speedy in-memory database
- ⏱  **Deploy in seconds** with first class support for `staging` and `production` envs

_Everything you need to build a modern cloud app with low code, terse config and zero ceremony._

---

## Install

```bash
npm install -g @architect/cli
```

Everything starts with an `.arc` file:

```arc
# this is an .arc file
@app
testapp

@http
get /
get /hellos
post /hello
```

`arc init` generates local function code:

```bash
/
├── src
│   └── http
│       ├── get-index/
│       ├── get-hellos/
│       └── post-hello/
└── .arc
```

The generated code in `/src/http/get-index/index.js` looks like this:

```javascript
exports.handler = async function http(request) {
  return {
    type: 'text/html',
    body: '<h1>Hello World! 🎉</h1>'
  }
} 
```

And `arc deploy` ships iterations on your code to the cloud. 

---

## Next steps

- [Tinker in the playground](/intro/playground)
- [Follow the quickstart](/quickstart)
- [Learn about HTTP Functions](/primitives/http)
