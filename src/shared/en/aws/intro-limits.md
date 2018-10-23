# Limits

The cloud has its limits. And `arc` itself is an abstraction with deliberate constraints. Whether we label them *constraints* or *limits*, they are **trade-offs** you need to be aware of when designing your software architecture for cloud functions.

Sometimes things with the cloud just fail, and you might not get a useful error. This means: one _must_ consider retries &mdash; including manual retries &mdash; where you create / destroy / recreate infra workflows (and, accordingly, `.arc` workflows are built to be run and re-run). 

We call this situation *immutable infrastructure* to feel better! &#128150;


## Cloud limits and gotchas

- Lambda cold starts are vicious on large Lambdas; the best antidote is to author small as possible Lambda functions (rule of thumb: sub 5MB compressed, including modules, usually results in sub-second execution)
- API Gateway: whereby 403 it probably meant 404 (missing a route usually returns a 403)
- Lambda functions cannot execute for longer than 5 minutes
- Lambda functions require you to `npm install` to your project `node_modules` individually


## Next: [Check out the quickstart](/quickstart)
