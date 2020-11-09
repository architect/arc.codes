@app
arc-codes

@static
fingerprint true

@http
get /
get /:lang
get /:lang/:cat
get /:lang/:cat/:doc
get /modules/*

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
