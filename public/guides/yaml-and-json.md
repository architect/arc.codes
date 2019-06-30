# `arc.yaml` and `arc.json`

## Opt into `arc.yaml` or `arc.json` configuration manifests

Developers that prefer `yaml` or `json` syntax can opt into using YAML or JSON instead of `.arc` syntax.

**YAML Example**

```yaml
---
# comments oo ehh
app: testapp
description: Example arc-to-json
domain: testapp.com
aws:
  region: us-west-2
  profile: personal
static:
  staging: testapp-bucket
  production: testapp-bucket-prod
http:
- get: "/"
- post: "/login"
- get: "/index.css"
- get: "/js/index.js"
- get: "/js/:mjs"
- get: "/api/notes"
- put: "/api/notes/:noteID"
- post: "/api/notes"
- delete: "/api/notes/:noteID"
- patch: "/api/notes/:noteID"
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
    "production": "testapp-bucket-prod"
  },
  "html": [
    {
      "get": "/"
    },
    {
      "post": "/login"
    },
    {
      "get": "/index.css"
    },
    {
      "get": "/js/index.js"
    },
    {
      "get": "/js/:mjs"
    },
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
  }
}
```

---

## Next: [Dependencies](/guides/deps)

