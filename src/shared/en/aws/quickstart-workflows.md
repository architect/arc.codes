# Workflows

## Execute common development workflows against an `.arc` file with `npm run` scripts

- [`npm run create`](#arc-create) creates code and corresponding cloud infrastructure
- [`npm run deploy`](#arc-deploy) deploys cloud functions
- [`npm start`](#arc-sandbox) runs cloud function code locally, offline and completely in memory
- [`npm run dns`](#arc-dns) to setup a custom domain

## <a href=#arc-create id=arc-create>Create code</a>

Create code and infra from `.arc` in the current directory:

```bash
npm run create
```

## <a href=#arc-deploy id=arc-deploy>`Deploy code`</a>

Deploy all code in `./src` to `staging`:

```bash
npm run deploy
```

Deploy all code in `./src` to `production`:

```bash
ARC_DEPLOY=production npm run deploy
```

Deploy a single function (example: `get /`) to `staging`:

```bash
npm run deploy src/html/get-index
```

Deploy a single function (example: `get /`) to `production`:

```bash
ARC_DEPLOY=production npm run deploy src/html/get-index
```

## <a href=#arc-dns id=arc-dns>Setup a custom domain</a>

Setting up a custom domain for API Gateway on Route53 requires the following steps:

- Setup certificates with AWS Certificate Manager
- Create a DNS Recordset on Route 53
- Setup `staging` and `production` Domains in API Gateway
- Create corosponding Alias records in Route 53

Proceed through these steps by running:

```bash
npm run dns
```

> Note: `npm run dns` needs to be re-run as you progress through setup steps of creating/verifying certificates

## <a href=#arc-sandbox id=arc-sandbox>Work locally in a sandbox</a>

Start a local web server and in-memory DynamoDB instance:

```bash
npm start
```

Tip: Works super well with [Nodemon](https://nodemon.io)!
