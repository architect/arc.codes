@app
arc-codes

@aws
region us-west-2
profile openjsf

@static
fingerprint true

@http
get /docs/:lang/*
get /api/package
any /*
get /landing

@plugins
spellcheck
architect/plugin-node-prune
enhance/ssr
enhance/arc-plugin-styles

@enhance-styles
config theme.json
