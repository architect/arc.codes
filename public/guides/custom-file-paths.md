# Custom file paths

By default, like many frameworks, Architect relies on "convention over configuration" – meaning you can expect certain things, like the placement of function handlers, to appear in default, deterministic locations.

However, some projects and integrations necessitate more granular configurability. For these needs, you can express your project in a more verbose format that exposes additional settings, such as source directory.

Use of custom file paths is completely opt-in on a Lambda by Lambda basis, trading off convention for flexibility. You can use it more easily and cleanly migrate existing repos to serverless tech, use frontend frameworks that have their own folder requirements, or to better enable local code transpilation.


### Example

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
