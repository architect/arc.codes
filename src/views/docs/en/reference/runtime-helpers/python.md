---
title: Python runtime helpers
category: Runtime helpers
description: "Python runtime utility package: `architect-functions`"
---

Architect provides an optional runtime utility package designed to make it significantly easier to work with provisioned resources and related assets: [`architect-functions`](https://pypi.org/project/architect-functions/)

We strongly suggest making use of this package when developing Python handlers with Architect.


## `architect-functions`

[View package source on GitHub](https://github.com/architect/functions-python/)


## Setup

Install `architect-functions` in your project's root `requirements.txt` file:

```bash
pip3 install architect-functions -r requirements.txt
```

Ensure `arc` is available to your Lambda function code:

```python
import arc
```

## Interfaces

- [`arc.events`](#arc.events) Publish / subscribe helpers for `@events` functions
- [`arc.http`](#arc.http) Request/response normalization and session support for `@http` functions
- [`arc.queues`](#arc.queues) Publish/subscribe helpers for `@queues` functions
- [`arc.services`](#arc.services()) Retrieves the Architect service map, exposing metadata for all services making up the application
- [`arc.tables`](#arc.tables) Generates a DynamoDB client for `@tables`
- [`arc.ws`](#arc.ws) WebSocket helpers for `@ws` functions
<!-- - [`arc.static`](#arc.static()) Get a `@static` asset path -->

---

## `arc.events`

Publish & subscribe helpers for `@events` functions. Declare events with the [`@events`](/docs/en/reference/project-manifest/events) pragma.


### `arc.events.parse()`

Parse the incoming (somewhat complicated, deeply-nested, JSON-encoded) `event`:

```python
import arc

def handler(evt):
    event = arc.events.parse(evt)
    print("incoming event:", event)
```


### `arc.events.publish()`

Publish an event to an `@events` function. Accepts two required arguments:
- **`name`** (string) - name of the `@events` function you'd like to publish to
- **`payload`** (dict or array) - payload to be published

```python
import arc

def handler(event):
    payload = {"hello": "there"}
    arc.events.publish("some-event", payload)
```

---

## `arc.http`

Request, response, and session methods for `@http` functions. Declare HTTP routes with the [`@http`](/docs/en/reference/project-manifest/http) pragma.


### `arc.http.parse_body()`

Parse or un-buffer the incoming `@http` request's body. Supports parsing JSON and form URL-encoded (`application/x-www-form-urlencoded`) data; other data types are merely decoded from base64 buffers.

```python
import arc

def handler(request, context):
    body = arc.http.parse_body(request)
    print("request body contents:", body)
```


### `arc.http.res()`

`arc.http.res()` provides a variety of conveniences when publishing HTTP responses, including built-in session writes, automatic compression and encoding of the response body, content-type shortcuts, and many more.

`arc.http.res()` accepts two required positional arguments:
- **`request`** (dict) - the originating handler request parameter
- **`response`** (dict) - response payload (see below)

A quick example:

```python
import arc

def handler(req, context):
    return arc.http.res(req, {"hello": "world"})
```

`arc.http.res()` response payloads honor the standard [API Gateway response payload properties](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) (`statusCode`, `headers`, `body`, etc.), in addition to adding the following convenience properties:

- `cache_control` - **str**
  - Sets the `cache-control` header (or overrides it if already present)
- `compression` - **bool**
  - Defaults to `gzip`; sets output compression of non-binary handler responses (e.g. JSON, HTML, etc.)
  - If requesting client does not support default (`gzip`), compression is automatically disabled
  - To manually disable output compression for non-binary responses, specify `False`
- `cookie` - **str**
  - Sets the `set-cookie` header (or overrides it if already present)
  - Note: this convenience property predates API Gateway HTTP v2.0's `cookies` property; if using that payload format (which is Architect's default), passing `cookies` (a list) is probably better
- `cors` - **bool**
  - Sets the `access-control-allow-origin` header to `*` (or overrides it if already present)
- `status`, `code`, `status_code` (alias of `statusCode`) - **int**
  - Sets the response HTTP status code
- `session` - **dict**
  - Create or overwrite a client session; see the [sessions guide for more](/docs/en/guides/frontend/sessions)
- `type` - **str**
  - Sets the `content-type` header (or overrides it if already present)

Additionally, you may also pass the following content properties (instead of manually setting `status`, `headers`, and `body`):

- `css` - **str**
  - Sets the `content-type` header to `text/css; charset=utf8`
- `html` - **str**
  - Sets the `content-type` header to `text/html; charset=utf8`
- `js` - **str**
  - Sets the `content-type` header to `text/javascript; charset=utf8`
- `json` - **dict or list**
  - JSON-encodes the object or array and sets the `content-type` header to `application/json; charset=utf8`
- `text` - **str**
  - Sets the `content-type` header to `text/plain; charset=utf8`
- `xml` - **str**
  - Sets the `content-type` header to `text/xml; charset=utf8`

Finally, you may also return an Exception, which will be interpreted as a status `500`, and output the Exception `title` in HTML.

> Learn more about [API Gateway response payloads here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html)


#### Examples

Respond with an HTML payload

```python
import arc

def handler(req, context):
    payload = {"html": "<h1>Hello, world!</h1>"}
    return arc.http.res(req, payload)
```


Mutate a session property, then persist it via response

```python
import arc

def handler(req, context):
    session = arc.http.session_read(req)
    session["count"] += 1
    return arc.http.res(
        req,
        {
            "session": session,
            "json": {"ok": True},
        }
    )
```

---


### `arc.http.session_read()`

Read a client session from an incoming request. Returns the client's session dict (or `{}` if none is found).

```python
import arc

def handler(req, context):
    session = arc.http.session_read(req)
    print("user name:", session.get("name"))
    return {"ok": True}
```

---

### `arc.http.session_write()`

Manually write a client session. Generally we recommend writing sessions by passing a `session` property via [`arc.http.res()`](#arc.http.res()).

However, should you need additional power and flexibility when writing sessions, we expose `arc.http.session_write()` for manually writing the session. This method returns a cookie that must be sent back to the client via the `set-cookie` header.

```python
import arc
import json

def handler(req, context):
    session = arc.http.session_read(req)
    session["count"] += 1
    cookie = arc.http.session_write(session)
    return {
        "statusCode": 200,
        "body": json.dumps({"ok": True}),
        "headers": {
            "set-cookie": cookie,
        },
    }
```

---

## `arc.queues`

Publish & subscribe helpers for `@queues` functions. Declare queues with the [`@queues`](/docs/en/reference/project-manifest/queues) pragma.


### `arc.queues.parse()`

Parse the incoming (somewhat complicated, deeply-nested, JSON-encoded) `event`:

```python
import arc

def handler(evt):
    event = arc.queues.parse(evt)
    print("incoming event:", event)
```


### `arc.queues.publish()`

Publish an event to an `@queues` function. Accepts two required arguments:
- **`name`** (string) - name of the `@queues` function you'd like to publish to
- **`payload`** (dict or array) - payload to be published

```python
import arc

def handler(event):
    payload = {"hello": "there"}
    arc.queues.publish("some-event", payload)
```

---

## `arc.services()`

Cloud resources are generated with names more friendly for machines than people. Other frameworks leave resource discovery up to end users, which leads to ad hoc implementations becoming a frequent bug vector. Architect treats service discovery as a first class concern.

> Amazon Resource Names (ARNs) are available at runtime to all Lambda functions defined in the same Architect project manifest. Things such as DynamoDB tables, SNS topics, SQS queues, API Gateway endpoints, and S3 static bucket ARNs are baked into `@architect/functions` so your runtime program logic interacts with resources using readable, people-friendly names defined in your Architect project manifest.

`arc.services()` retrieves the Architect service map: an object mapping the plugins and out-of-the-box Architect infrastructure that makes up your application.

This object is lazily-loaded and cached, and thus the first call may incur a delay as the service map is populated (use of [`arc.events`](#arc.events), [`arc.queues`](#arc.queues) and [`arc.tables`](#arc.tables) transparently uses this method in the background).

`arc.services()` returns a service map object, with keys equaling any out-of-the-box Architect infrastructure types or plugins used by the Architect application.

An example service map for an application composed of `@static`, `@events` and an `imagebucket` plugin would have the following structure:

```python
import arc

def handler(event):
    services = arc.services()
    print(services)
    # {
    #   # a plugin named 'imagebucket' exposing some service discovery variables
    #   "imagebucket": {
    #     "accessKey": "someAccessKey",
    #     "name": "arc-plugin-s3-image-bucket-example-image-buket",
    #     "secretKey": "someSecretKey"
    #   },
    #   # built-in @static service discovery variables
    #   "static": {
    #     "bucket": "arcplugins3imagebucketexamplestaging-staticbucket-g8rsuk82ancj",
    #     "fingerprint": "false"
    #   },
    #   # built-in @events service discovery variables
    #   "events": {
    #     "myevent": "https://some-sns-url.amazon.us-east-2.com"
    #   }
    # }
```

---

## `arc.tables`

Client & resource helpers for DynamoDB tables. Declare tables with the [`@tables`](/docs/en/reference/project-manifest/tables) pragma.


### `arc.tables.name()`

Helper method that accepts a logical table name string, and returns a physical AWS resource name. Helpful for when you need to go lower level than the DynamoDB resource provided by `arc.tables.table()`.

For example use `arc.tables.name('my-table')` to get the human-unfriendly AWS name of the `my-table` `@tables` resource.

```python
import arc

def handler(event):
    name = arc.tables.name('my-table')
    print(name)
    # MyTableStagingABC123
```


### `arc.tables.table()`

Accepts a logical table name string and returns a DynamoDB client (specifically, a [DynamoDB resource](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb/table/index.html)) for your application's `@tables`.

```python
import arc

def handler(event):
    data = arc.tables.table('my-table')
    items = data.scan()
    print("all data from my-table:", items.get("Items"))
```

---

## `arc.ws`

Interact with WebSocket services. Declare endpoints with the [`@ws`](/docs/en/reference/project-manifest/ws) pragma.


### `arc.ws.send()`

Send a message via WebSocket. Accepts two required positional parameters:
- **`id`** (string) - API Gateway `ConnectionId` of the client you'd like to send the message to
- **`payload`** (dict or list) - payload to be sent to the WebSocket client (as JSON)

```python
# src/ws/connect/lambda.py
import arc

def handler(req, context):
    connection_id = req["requestContext"]["connectionId"]
    arc.ws.send(connection_id, {"hello": "there"})
```


### `arc.ws.api()`

Return the internal [`ApiGatewayManagementApi` client](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/apigatewaymanagementapi.html) from `boto3`.

```python
import arc

def handler(req, context):
    api = arc.ws.api()
```


### `arc.ws.close()`

Close a WebSocket connection with the provided id:
- **`id`** (string) - API Gateway `connectionId` of the client you'd like to close

```python
import arc

def handler(req, context):
    connection_id = req["requestContext"]["connectionId"]
    arc.ws.close(connection_id)
```


### `arc.ws.info()`

A pass-through to the [ApiGatewayManagementApi#get_connection](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/apigatewaymanagementapi/client/get_connection.html) method. Retrieve information about the connection with the provided id:
- **`id`** (string) - API Gateway `ConnectionId` of the client you'd like get information about

```python
# src/ws/connect/lambda.py
import arc

def handler(req, context):
    connection_id = req["requestContext"]["connectionId"]
    info = arc.ws.info(connection_id)
    print(info)
    # {
    #     "ConnectedAt": datetime(2023, 1, 1),
    #     "Identity": {
    #         "SourceIp": "10.0.0.1",
    #         "UserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."
    #     },
    #     "LastActiveAt": datetime(2023, 8, 11)
    # }
```
