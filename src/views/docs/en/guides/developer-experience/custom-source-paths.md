---
title: Custom source paths
category: Developer experience
---

Define resources in a more verbose format to configure custom Lambda source directories. Custom source paths are completely opt-in on a Lambda by Lambda basis; this is trading off default conventions for flexibility at the price of slightly more `app.arc` verbosity.

## Use cases

- Migrate existing repos to the [Functional Web App pattern](https://fwa.dev)
- Use frontend frameworks that have their own folder requirements
- Better enable local code transpilation by pointing to generated `./dist` directories


## Example

<arc-viewer default-tab=arc>
<div slot=contents>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
my-arc-app

@http
# simple
get /foo
# verbose
/bar
  method get
  src whatever/http/dir/you/want

@events
# simple
an-event
# verbose
another-event
  src whatever/events/dir/you/want

@scheduled
# simple
a-schedule rate(1 day)
# verbose
another-schedule
  rate 1 day
  src whatever/scheduled/dir/you/want

```
</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "app": "my-arc-app",
  "http": [
    ["get", "/foo"],
    {
      "/bar": {
        "method": "get",
        "src": "whatever/http/dir/you/want"
      }
    }
  ],
  "events": [
    "an-event",
    {
      "another-event": {
        "src": "whatever/events/dir/you/want"
      }
    }
  ],
  "scheduled": {
    "a-schedule": {
      "rate": [1, "day"]
    },
    "another-schedule": {
      "rate": [1, "day"],
      "src": "whatever/schedueld/dir/you/want"
    }
  }
}

```
</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
---
app: my-arc-app

http:
# simple
- get: "/foo"
# verbose
- "/bar":
    method: "get"
    src: "whatever/http/dir/you/want"

events:
# simple
- "an-event"
# verbose
- "another-event":
    src: "whatever/events/dir/you/want"

scheduled:
# simple
- "a-schedule":
    rate:
      - 1
      - day
# verbose
- "another-schedule":
    rate:
      - 1
      - day
    src: "whatever/scheduled/dir/you/want"

```
</div>
</arc-tab>

</div>
</arc-viewer>
