---
title: Architect sessions
category: Frontend
description: Use HTTP sessions in an Architect project
sections:
  - Overview
  - HTTP sessions
  - Choosing a session store
  - Session configuration
  - Strong session secret
  - Examples
---

## Overview

Session state is the first primitive to understand for building stateful interactions on the web. HTTP is a stateless protocol, which is a fancy way of saying every HTTP request is effectively a clean slate. If you want to remember things between HTTP requests you need a session.

This guide will go over several ways to store session state within your Architect app. There is an example app at the end that demonstrates how sessions work.


## HTTP sessions

Architect provides built-in session capabilities for `@http` defined routes via [`@architect/functions`](/docs/en/reference/runtime-helpers/node.js) (Node.js) and [`architect-functions`](/docs/en/reference/runtime-helpers/python) (Python).

- Requests are tagged to a session via a stateless, signed, `httpOnly` cookie: `_idx`
- By default session data is stored in JWE, but we suggest making use of Architect's built-in database-backed session storage (more on that below)
- JWE session data is long-lived in the client, while database-backed session data expires after a week of inactivity
  - Session expiration for both JWE and database-backed sessions is configurable

This allows you to write fully stateful applications despite Lambda functions being completely stateless. Here's a minimal example of how to read and write a session using Architect's runtime helpers:

```javascript
// a simple request counter
let arc = require('@architect/functions')

// Session is appended to the request by `@architect/functions`; we'll increment it each time
exports.handler = async function http(req) {
  let { session } = req // Session will be {} if unknown or invalid
  session.count = (session.count || 0) + 1
  return {
    session,
    html: `<pre>${JSON.stringify(session, null, 2)}</pre>`,
  }
}
```

> See the [Node.js sessions](../../reference/runtime-helpers/node.js#arc.http.session) and [Python sessions](../../reference/runtime-helpers/python#arc.http.session) references for more details


## Choosing a session store

Architect provides two means of session storage: [JWE (cookie-based)](#jwe-backed-sessions) and [database-backed](#database-backed-sessions). Below we'll explore the advantages and disadvantages to each, and how to [configure them](#session-configuration).

Architect's methods are the same no matter which session storage method you use, so business logic won't be a factor in your decision. That said, **if you choose to change session storage method from one to the other, existing sessions will be invalidated during the change**.


### JWE-backed sessions

By default, Architect sessions in new projects default to [JWE (JSON web encryption)](https://datatracker.ietf.org/doc/html/rfc7516) based storage. While JWE-backed sessions are fast and reliable, we recommend [database-backed sessions](#database-backed-sessions) for mission-critical applications.

Pros
- Slightly easier to set up
- Minimal latency associated with reading / writing session data

Cons
- Significantly less session data can be stored (~4KB)
- Session data is stored in the client, meaning developers cannot as easily mutate, fix, or analyze user session data


### Database-backed sessions

Architect recommends database-backed sessions, which are fast, robust, easy to use, and can be mutated or analyzed out of band when necessary.

Pros
- Up to ~400KB session storage data (10 times greater than JWE)
- Ability to manually mutate, fix, or analyze session data out of band

Cons
- If your app scales to many millions or billions of requests per month, you may incur small charges


## Session configuration

Outside of the [session storage medium](#storage-medium) configuration, almost all session configuration is done via environment variables.


### Storage medium

By default, Architect sessions are JWE-backed, and no further configuration is necessary to begin using them. To configure database-backed sessions:

1. Add a sessions table to your project manifest

```arc
@tables
sessions  # Any name is fine, we suggest 'sessions'; do not use 'jwe'
  _idx *  # [Required]
  ttl ttl # [Required]
```

2. Add the corresponding `ARC_SESSION_TABLE_NAME` environment variable to your environments (in this example, for the table named `sessions`):

```bash
npx arc env -e testing -a ARC_SESSION_TABLE_NAME sessions
npx arc env -e staging -a ARC_SESSION_TABLE_NAME sessions
npx arc env -e production -a ARC_SESSION_TABLE_NAME sessions
```

3. If your app is already deployed, you will then need to [redeploy](/docs/en/reference/cli/deploy) it for the changes to take effect.

To reconfigure JWE-backed sessions, simply run the same commands above, setting the `ARC_SESSION_TABLE_NAME` env var to `jwe` (instead of your sessions table name).


### General settings

The following configuration environment variables are available to all Architect sessions:

- `ARC_APP_SECRET` - **Strongly recommended!** Please see the section below for [setting a strong session secret](#strong-session-secret)
- `ARC_SESSION_DOMAIN` - Not set by default; define the cookie's [`Domain` attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent)
- `ARC_SESSION_SAME_SITE` - Set to `lax` by default; define the cookie's [`SameSite` attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#samesite_attribute)
- `ARC_SESSION_TTL` - Default is very long-lived; define the cookie's `expires` attribute; expiry in seconds (e.g. configure `86400` to set the expiry for 1 day of inactivity)
  - Note: despite whatever is set in the cookie's `expires` attribute, database-backed sessions are always automatically expunged in the database after one week of inactivity


### JWE encryption configuration

- `ARC_APP_SECRET_ALGO` - Set to `A256GCM` by default; configure the `AES/GCM` encryption key bit-length, must be one of `A256GCM`, `A192GCM`, `A128GCM`
  - Architect's default key **should not be assumed to be safe or secure**; for many basic purposes that may be ok, although we strongly recommend [setting a strong session secret](#strong-session-secret)
  - Please note the minimum algorithm key sizes listed here. Longer keys will be truncated to the appropriate key size, while shorter keys will result in a validation error:
    - `A256GCM` 256 bit (32 octet)
    - `A192GCM` 192 bit (24 octet)
    - `A128GCM` 128 bit (16 octet)
- `ARC_FORCE_LEGACY_JWE_SECRET` - Forces compatibility with JWE session secrets from older versions of `@architect/functions`; not suggested unless you cannot upgrade to v7 or greater.


## Strong session secret

Architect's default session secret key **should not be assumed to be safe or secure**. As such, we strongly recommend setting a strong session secret. This secret is used for encryption in JWE sessions, and securely signing database-backed sessions.

Database-backed sessions should use a very high entropy secret (we suggest at least 32 characters / 256 bit), but any value will be used. JWE-backed sessions must have a 256 bit or higher secret by default; any characters beyond that length will be truncated.

```bash
npx arc --env production --add ARC_APP_SECRET something-significantly-better-than-this
```

Quickly generate a secret with `openssl`:

```bash
npx arc env -e staging -a ARC_APP_SECRET $(openssl rand -base64 32)
npx arc env -e production -a ARC_APP_SECRET $(openssl rand -base64 32)
```


## Examples

### Example repo

Please do check out the [`architect-examples/sessions`](https://github.com/architect-examples/sessions) for a complete example project for working with Architect JWE and database-backed sessions in either JS or Python.


### Return an incremented session

Assumes you have [`@architect/functions`](https://www.npmjs.com/package/@architect/functions) or [`architect-functions`](https://pypi.org/project/architect-functions/) installed.

<arc-viewer default-tab=Node.js>
<div slot=contents>
<arc-tab label=Node.js>
<h5>Node.js</h5>
<div slot="content">

```javascript
import arc from '@architect/functions'

export const handler = arc.http(async req => {
  let count = (req.session.count || 0) + 1
  let session = { count }
  return {
    session,
    json: session
  }
})
```

</div>
</arc-tab>

<arc-tab label=Python>
<h5>Python</h5>
<div slot="content">

```python
import arc

def handler(req, context):
    sesh = arc.http.session_read(req)
    count = sesh.get("count", 0) + 1
    session = {"count": count}
    return arc.http.res(req, {"session": session, "json": session})
```

</div>
</arc-tab>
</div>
</arc-viewer>


### Destroy a session's contents

Assumes you have [`@architect/functions`](https://www.npmjs.com/package/@architect/functions) or [`architect-functions`](https://pypi.org/project/architect-functions/) installed.

<arc-viewer default-tab=Node.js>
<div slot=contents>
<arc-tab label=Node.js>
<h5>Node.js</h5>
<div slot="content">

```javascript
import arc from '@architect/functions'

export const handler = arc.http(async req => {
  return {
    session: {},
    json: { ok: true }
  }
})
```

</div>
</arc-tab>

<arc-tab label=Python>
<h5>Python</h5>
<div slot="content">

```python
import arc

def handler(req, context):
    return arc.http.res(
      req,
      {"session": {}, "json": {"ok": True}}
    )
```

</div>
</arc-tab>
</div>
</arc-viewer>
