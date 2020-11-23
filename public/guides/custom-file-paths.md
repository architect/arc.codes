# Custom file paths

## Custom filesystem / Verbose arc format 

Initially, we went with "convention over configuration" with our Infra as Code file structure, but the feedback was clear. Many developers asked for a way to organize files themselves for more granular configurability. We call this the verbose arc format and it's available in various lambda pragmas.

The great thing about completely configurable file paths is that it has a nice knock-on effect. You can use an existing repo with any existing sort of app and migrate it cleanly to serverless tech.

Custom file paths is completely your choice to opt into. It is slightly more verbose Infra as Code, trading off convention for flexibility. This also enables transpiled code to work locally and without hacks.


## Example

This example shows the conventional way vs. the custom file path way.

```arc
@http
# conventional way
get /foo 
# custom way
/bar    
  method get
  src whatever/dir/you/want

@events
# conventional way
an-event 
# custom way       
another-event   
  src foo

@scheduled
# conventional way
a-schedule rate(1 day)
# custom way
another-schedule        
  rate 1 day
  src something
```