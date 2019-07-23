# CDN
## Add a content delivery network with AWS CloudFront

The most mature and powerful content delivery network is AWS CloudFront. [Read more on the official AWS docs.](https://aws.amazon.com/cloudfront/features/?nc=sn&loc=2)

---

- <a href=#provision><b>🌾 Provision and Deploy</b></a>  
- <a href=#important><b>⚠️ Important</b></a> implementation notes
- <a href=#fingerprint><b>🔎 Fingerprint</b></a> and ensure cache invalidation 

---

<h2 id=provision>🌾 Provision</h2>

Given the following `.arc` file:

```arc
@app
my-site

@cdn
@static
```

Running `arc deploy` will create a CloudFront distribution for the S3 bucket website URL.

Likewise, the following `.arc`:

```arc
@app
my-site

@cdn
@static
@http
get /api
post /graphql
```

Running `arc deploy` will create a CloudFront distribution for the S3 website and the API Gateway routes defined by the `@http` primitive.

---

<h2 id=important>⚠️ Important</h2>

CloudFront support is implemented independently of CloudFormation because the deployment performance combining these services is unacceptably slow. 

Unfortunately when CF distributions are deployed via CloudFormation they are updated every deployment and this can push the feedback cycle 15 to 20 minutes. For this reason Architect creates a CDN distribution if you have `@cdn` in the `.arc` asynchronously via the AWS SDK and when it is available you will see `cloudfront.com` URLs printed the console. Likewise, removing `@cdn` from the distribution will mark it for deletion (which itself can take a long time). 

---

<h2 id=fingerprint>🔎 Fingerprint</h2>

Enable fingerprinting in `.arc`:

```arc
@app
my-site

@cdn
@static
fingerprint true

```

This ensures your application can be updated independently of long lived caches.

---
