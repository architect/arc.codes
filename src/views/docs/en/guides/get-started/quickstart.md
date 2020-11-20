**Quickstart**

1. Install Architect

```bash
npm install -g @architect/architect
```

2. Create a project folder

```bash
mkdir testapp
cd testapp
```

3. Run `arc init` to generate a basic project:

```
/
├── src
│   └── http
│       └── get-index/index.js
└── app.arc
```

4. Check out your first `app.arc` file & HTTP function!

```bash
# /project/path/app.arc
@app
your-app-name

@http
get /
```

```javascript
// src/http/get-index/index.js

exports.handler = async function http(request) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8;' },
    body: '<h1>Hello World! 🎉</h1>'
  }
}
```

## That's it! Ready to ship?

Ensure you've [met the system prerequisites](/en/guides/get-started/detailed-setup) and run: `arc deploy`.

Your new app will be online within seconds.

**Want to join the community and learn more?**

- [Join the Architect community on Slack!](https://join.slack.com/t/architecture-as-text/shared_invite/MjE2MzU4Nzg0NTY1LTE1MDA2NzgyMzYtODE2NzRkOGRmYw)

- Star [`@architect/architect`](https://github.com/architect/architect) on GitHub

- [Follow the detailed setup](/en/guides/get-started/detailed-setup)
