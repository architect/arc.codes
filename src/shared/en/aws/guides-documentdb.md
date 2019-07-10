# DocumentDB and MongoDB

## Using JSON-like storage

As an alternative to DynamoDB, you can use a JSON-style document store. You can use a normal MongoDB client (like node's `mongodb` ) to connect all three of these. Follow the [node MongoDB documentation](http://mongodb.github.io/node-mongodb-native/3.2/).

### AWS DocumentDB

AWS has more recently included [DocumentDB](https://aws.amazon.com/documentdb/), a MongoDB compatible database for storing JSON-like documents. However unlike DynamoDB, DocumentDB requires persistent large EC2 instances to be deployed and running continuously. As a result DocumentDB can be *very* expensive even if you're not using it much.

### MongoDB Atlas in AWS

MongoDB inc also provide [MongoDB Atlas](), which has a [free tier](https://docs.mongodb.com/manual/tutorial/atlas-free-tier-setup/). Note the free tier (M0) is only available in certain AWS regions - at the time of writing `us-east-1` and `eu-central-1`. MongoDB Atlas also has [lower pricing](https://www.mongodb.com/cloud/atlas/pricing) than DocumentDB.

### MongoDB Server in the Arc Sandbox 

You can install MongoDB server and use it from the Arc sandbox. 

> In the sandbox, you'll need to close DB connections for your lambdas to complete. This is a limit of the current sandbox and should go away in future.

## DocumentDB/Mongo in AWS

In your lambdas (and, as of Architect Functions v4, your middleware), use:

```javascript
context.callbackWaitsForEmptyEventLoop = false
```

this will [re-use the connection on the next lambda invocation](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html) (if AWS can re-use the same Lambda container)

---


## Next: [Static Assets](/guides/static-assets)
