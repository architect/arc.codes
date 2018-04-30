# Limits

The cloud has limits. And `arc` itself is an abstraction with deliberate constraints. Whether we label them *constraints* or *limits*, they are **tradeoffs** you need to be aware of when designing your software architecture for cloud functions.

Sometimes with the Cloud things just fail and you might not get a useful error. This means: you _must_ consider retrys, including manual retrys, where you create / destroy / recreate infra workflows (and, accordingly, `.arc` workflows are built to be run and re-run). 

We call this situation *immutable infrastructure* to feel better! &#128150;

## Cloud limits and gotchas

- Lambda cold starts are vicious on large Lambdas; the best antidote is to author small as possible Lambda functions (rule of thumb: sub 5MB compressed, including modules, usually results in sub-second execution)
- API Gateway: whereby 403 it probably meant 404 (missing a route usually returns a 403)
- Lambdas cannot execute for longer than 5 minutes
- Lambda functions require you to `npm install` to your project `node_modules` individually

## `.arc` constraints

Most of these constraints were borne out of necessity for speed; velocity aided by way of minimum essential capability. These items will be great topics of community discussion and future contribution, so file them as: _maybe someday_.

- `PATCH`, `PUT`, `DELETE` are currently not supported (but 100% support everything browsers do: `GET` and `POST`)
- Routes must be unique (i.e. no overloading `Content-Type`); it's certainly possible to get around, but you probably don't want to do that anyhow

## Next: [Check out the quickstart](/quickstart)
