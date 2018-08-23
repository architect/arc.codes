# `arc.yaml` and `arc.json`

> Optin to `arc.yaml` or `arc.json` configuration

Developers that prefer `yaml` or `json` syntax can opt into using YAML or JSON instead of `.arc` syntax.

**YAML Example**

```yaml
---
# commenst oo ehh
app: testapp
description: Example arc-to-json
domain: testapp.com
aws:
  region: us-west-2
  profile: personal
static:
  staging: testapp-bucket
  production: testapp-buckea-prod
html:
- get: "/"
- post: "/login"
css:
- "/index.css"
js:
- "/js/index.js"
- "/js/:mjs"
text:
- "/robots.txt"
- "/humans.txt"
json:
- get: "/api/notes"
- put: "/api/notes/:noteID"
- post: "/api/notes"
- delete: "/api/notes/:noteID"
- patch: "/api/notes/:noteID"
xml:
- get: index.rss
events:
- send-welcome-sms
tables:
- notes:
    authorID: "*String"
    noteID: "**String"
- authors:
    authorID: "*String"
indexes:
- authors:
    phone: "*String"
scheduled:
  daily-report: rate(1 day)
slack:
- statsbot
```

**JSON Example**

```json
{
  "app": "testapp",
  "description": "Example arc-to-json",
  "domain": "testapp.com",
  "aws": {
    "region": "us-west-2",
    "profile": "personal"
  },
  "static": {
    "staging": "testapp-bucket",
    "production": "testapp-buckea-prod"
  },
  "html": [
    {
      "get": "/"
    },
    {
      "post": "/login"
    }
  ],
  "css": [
    "/index.css"
  ],
  "js": [
    "/js/index.js",
    "/js/:mjs"
  ],
  "text": [
    "/robots.txt",
    "/humans.txt"
  ],
  "json": [
    {
      "get": "/api/notes"
    },
    {
      "put": "/api/notes/:noteID"
    },
    {
      "post": "/api/notes"
    },
    {
      "delete": "/api/notes/:noteID"
    },
    {
      "patch": "/api/notes/:noteID"
    }
  ],
  "xml": [
    {
      "get": "index.rss"
    }
  ],
  "events": [
    "send-welcome-sms"
  ],
  "tables": [
    {
      "notes": {
        "authorID": "*String",
        "noteID": "**String"
      }
    },
    {
      "authors": {
        "authorID": "*String"
      }
    }
  ],
  "indexes": [
    {
      "authors": {
        "phone": "*String"
      }
    }
  ],
  "scheduled": {
    "daily-report": "rate(1 day)"
  },
  "slack": [
    "statsbot"
  ]
}
```

<hr>
## Next: [Work Locally](/guides/offline)
