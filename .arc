@app
arc-codes

@aws
region us-east-1
profile smallwins
bucket cf-sam-deployments-east

@static
@http
get /
get /api/:version/package
get /api/:version/init
