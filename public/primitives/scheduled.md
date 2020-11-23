# Scheduled

## Run cloud functions on an interval

The `@scheduled` primitive creates stateless functions that run on a schedule.

---

- <a href=#local><b>🚜 Work Locally</b></a>
- <a href=#provision><b>🌾 Provision</b></a>
- <a href=#deploy><b>⛵️ Deploy</b></a>
- <a href=#expressions><b>🕰 Expressions</b></a>
- <a href=#event><b>🎉 Event Payload</b></a>

---

<h2 id=local>🚜 Work Locally</h2>

An example `app.arc` file:

```arc
@app
testapp

@scheduled
cleanup rate(1 day)
tweet rate(1 hour)
```

By default, Architect uses a consistent, convention-based filesystem structure for your Lambda function code. However, if you'd like to define your own directory structure, you may do so by specifying properties of a given function using the following format:

```arc
@scheduled
cleanup rate(1 day) # uses: src/scheduled/cleanup/
tweet
  rate 1 hour
  src src/functions/tweet/
```

---

<h2 id=provision>🌾 Provision</h2>

Scheduled functions create the following AWS resources:

- `AWS::Events::Rule`
- `AWS::Lambda::Function`
- `AWS::Lambda::Permission`

> **Protip:** increase `timeout` in `.arc-config` for longer running functions

---

<h2 id=deploy>⛵️ Deploy</h2>

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy dirty` to overwrite deployed staging lambda functions
- `arc deploy production` to run a full CloudFormation production deployment

---

<h2 id=expressions>🕰 Expressions</h2>

Scheduled functions can be configured with either `rate` or `cron`.

> Rate expressions are simpler to define but don't offer the fine-grained schedule control that cron expressions support. For example, with a cron expression, you can define a rule that triggers at a specified time on a certain day of each week or month. In contrast, rate expressions trigger a rule at a regular rate, such as once every hour or once every day. <br> ☛ [AWS Scheduled Events Docs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html)

Example `app.arc`:

```arc
@app
testapp

@scheduled
daily-task rate(1 day)
check-email rate(10 minutes)
tweet cron(0/20 * ? * MON-FRI *) # every 20 mins weekdays
```

---

<h2 id=event>🎉 Event Payload</h2>

The function is invoked with a payload that has the following useful keys:

- `account` - the current AWS account number
- `time` - timestamp
- `region` - current AWS region
- `resources` - current executing ARN

---
