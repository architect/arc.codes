@app
arc-codes

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
