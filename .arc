@app
arc-codes

@aws
region us-west-1
profile openjsf
bucket arc.codes-deploy

@static
@http
get /
get /api/:version/package
