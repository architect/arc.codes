# Scheduled

## Run cloud functions on an interval

The `@scheduled` primitive creates stateless functions that run on a schedule. 

---

- <a href=#local><b>🚜 Work Locally</b></a> 
- <a href=#provision><b>🌾 Provision</b></a> 
- <a href=#deploy><b>⛵️ Deploy</b></a>
- <a href=#event><b>🎉 Event Payload</b></a>

---

<h2 id=local>🚜 Work Locally</h2>

An example `.arc` file:

```arc
@app
testapp

@scheduled
cleanup rate(1 day)
tweet rate(1 hour)
```

Architect generates the following functions:

- `src/scheduled/cleanup` 
- `src/scheduled/tweet` 

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

<h2 id=event>🎉 Event Payload</h2>

The function is invoked with the following keys:

- `version`
- `id`
- `detail-type`
- `source`
- `account` the current AWS account number
- `time`
- `region`
- `resources`
