---
title: Quickstart
category: Get started
description: Get started quickly with Architect
sections:
  - Quickstart
  - That's it
---

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

<arc-tab-bar>

<div slot="content">

<arc-tab label=arc>

<h5>arc</h5>

<div slot=content>

```arc
# /project/path/app.arc
@app
your-app-name

@http
get /
```

</div>

</arc-tab>

<arc-tab label=json>

<h5>json</h5>

<div slot=content>

```json
{
  "app": "your-app",
  "http": [
    "get /"
  ]
}
```

</div>

</arc-tab>

<arc-tab label=yaml>

<h5>yaml</h5>

<div slot=content>

```yaml
---
app: your-app-name
http:
- get: "/"
```

</div>

</arc-tab>

<arc-tab label=toml>

<h5>toml</h5>

<div slot=content>

```toml
app="your-app-name"
http=[
  ["get", "/"]
]
```

</div>

</arc-tab>

</div>

</arc-tab-bar>

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

---

**Want to join the community and learn more?**

- [Join the Architect community on Slack!](https://join.slack.com/t/architecture-as-text/shared_invite/MjE2MzU4Nzg0NTY1LTE1MDA2NzgyMzYtODE2NzRkOGRmYw)

- Star [`@architect/architect`](https://github.com/architect/architect) on GitHub

- [Follow the detailed setup](/en/guides/get-started/detailed-setup)
