# Limits &amp; Superpowers

The cloud has its limits. And `arc` itself is an abstraction with deliberate constraints. Whether we label them *constraints* or *limits*, they are **trade-offs** you need to be aware of when designing your software architecture for cloud functions.

## Cloud limits and gotchas

- Lambda cold starts are vicious on large Lambdas; the best antidote is to author small as possible Lambda functions (rule of thumb: sub 5MB compressed, including modules, usually results in sub-second execution)
- Lambda functions are time-limited to 5 seconds [by default](/reference/arc-config). This can be [adjusted](/reference/arc-config), however they cannot execute for longer than 15 minutes maximum. You can also use [background tasks](/guides/background-tasks) to break work down into smaller chunks. 

## Cloud Superpowers

- Less code is faster to write
- Functions are faster to deploy
- Determinism thx to infra as code deployments 
- Extensibility w the entire AWS ecosystem of services and tools
- Predicable costs and 100% utilization (scale to zero)
- Do less of everything: patching, no upgrading, no more orchastration
- Faster debugging
- Better isolation also equals better security posture and least privilige by default

Focus on unique business value, only maintain differentiated code and iterate faster with tighter feedback loops.

## Next: [Check out the quickstart](/quickstart)

