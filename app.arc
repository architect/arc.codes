@app
arc-codes

@aws
region us-west-2
profile openjsf

@static
fingerprint true

@http
get /
get /docs/:lang/*
get /api/package
any /*

@plugins
spellcheck
architect/plugin-node-prune
enhance/arc-plugin-styles

@enhance-styles
config theme.json
