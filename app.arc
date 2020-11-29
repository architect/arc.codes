@app
arc-codes

@aws
region us-west-1
profile openjsf
bucket arc.codes-deploy
apigateway http

@cdn
@static
@http
get /playground
get /api/:version/package
get /*
