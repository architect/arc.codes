@app
arc-codes

@aws
region us-west-1
profile openjsf
bucket arc.codes-deploy

@cdn
@static
@http
get /
get /playground
get /api/:version/package
