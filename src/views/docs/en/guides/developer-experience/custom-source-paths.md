---
title: Custom source paths
category: developer experience
---

Define resources in a more verbose format to configure custom Lambda source directories. Custom source paths are completely opt-in on a Lambda by Lambda basis; this is trading off default conventions for flexibility at the price of slightly more `app.arc` verbosity. 

### Use cases

- Migrate existing repos to serverless tech
- Use frontend frameworks that have their own folder requirements
- Better enable local code transpilation by pointing to generated `./dist` directories

## Example

```arc
@http
# simple
get /foo

# verbose
/bar
  method get
  src whatever/dir/you/want

@events
# simple
an-event

# verbose
another-event
  src foo

@scheduled
# simple
a-schedule rate(1 day)

# verbose
another-schedule
  rate 1 day
  src something
```


