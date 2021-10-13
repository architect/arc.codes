@app
v8-arc-codes

@aws
region us-west-1
profile openjsf
bucket arc.codes-deploy
apigateway http

@static
folder public
fingerprint true

@http
get /docs/:lang/*
get /api/package
any /*
