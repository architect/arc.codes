@app
arc-codes

@aws
region us-west-1
profile openjsf
bucket arc.codes-deploy
apigateway http

@static
fingerprint true

@http
get /
get /docs/:lang/*

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
