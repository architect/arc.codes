@app
arc-codes

@aws
region us-west-2
profile openjsf
architecture arm64

@static
fingerprint true

@http
get /docs/:lang/*
get /api/package
any /*
