# Limits

The cloud has its limits. And `arc` itself is an abstraction with deliberate constraints. Whether we label them *constraints* or *limits*, they are **trade-offs** you need to be aware of when designing your software architecture for cloud functions.

## Cloud limits and gotchas

- Lambda cold starts are vicious on large Lambdas; the best antidote is to author small as possible Lambda functions (rule of thumb: sub 5MB compressed, including modules, usually results in sub-second execution)
- Lambda functions are time-limited to 5 seconds [by default](/reference/arc-config). This can be [adjusted](/reference/arc-config), however they cannot execute for longer than 15 minutes maximum. You can also use [background tasks](/guides/background-tasks) to break work down into smaller chunks. 

## Next: [Check out the quickstart](/quickstart)
