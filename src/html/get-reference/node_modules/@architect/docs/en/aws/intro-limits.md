# Limits

The cloud has limits. And arc itself is an abstraction with deliberate constraints. Whether we label them *constraints* or *limits* these things are **tradeoffs** you need to be aware of designing a software architecture.

## Cloud Limits

- Stuff **Just Fails** and you won't always get a useful error 
  - This means: you HAVE to consider retrys including manual retrys where you create/destory/recreate infra workflows (and accordingly `.arc` workflows are intended to be run and rerun)
  - Yes: I guess it is "kinda gross"! But: it works. Call this condition *immutable infrastructure* and maybe you'll feel better about it? &#128150;
- Regions go down and there isn't really a great way beyond a DNS change window to move them
- Lambda cold starts are vicious on large lambdas; the best antidote is to author small as possible lambda functions (rule of thumb: sub 5mb is sub second)
- API Gateway: whereby 403 it probably meant 404
- General Sketchyness that is Distributed Systems (Grey failtures)
- API Gateway api limits are brutal so creating http routes is kinda slow (a lot of routes can take minutes)
- Cloudwatch logs are not structured (so we search for `console.log` strings instead of querying structured data---inspectability is hugely important for a prod system)
- Lambdas cannot execute for longer than 5 minutes 
- Lambda functions require you to `npm install` to your project `node_modules` individually before deployment

## Arc Constraints ;)

File these things as: maybe someday. Many of these constraints where out of bare neccessity of speed aided by attempts to arrive an sort of minimum possible essentials. These items will be great topics of community discussion and future contribution.

- `PATCH`, `PUT`, `DELETE` are not suppported but maybe they shouldn't be (100% support everthing browsers do: `GET` and `POST` ;)
- Routes must be unqiue (no overloading `Content-Type`); its possible but you probably don't want to do that anyhow
- An `application/x-form-urlencoded` `POST` must respond with a redirect
- Currently only `String` and `Number` types are supported for Partition and Sort keys in DynamoDB
 
## Next Steps

- [Check out the Quickstart.](/quickstart)
