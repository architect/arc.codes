@app
arc-codes

@domain
arc.codes

@http
get /
get /intro
get /intro/:introID
get /quickstart
get /quickstart/:quickstartID
get /reference
get /reference/:refID
get /guides
get /guides/:guideID
get /examples
get /examples/:exampleID

@static
staging arc.codes-staging
production arc.codes

@aws
region us-west-2
profile jsf
