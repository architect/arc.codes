---
title: Scheduled functions
description: Background tasks on a schedule
sections:
  - Overview
  - Getting started
  - Events
  - Examples
---

## Overview

Scheduled functions are functions that are invoked at specified times and can be used in conjunction with event functions to send messages on a schedule. Architect uses [CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) to create rules that self-trigger on an automated schedule using cron or rate expressions. All scheduled events use the UTC time zone, and the minimum precision for schedules is 1 minute.

**Sections**
[Getting Started](#getting-started)
[Cron Expressions](#cron-expressions)
[Rate Expressions](#rate-expressions)
[Examples](#examples)

## Getting started

To get started with scheduled functions we must first add the `@scheduled` pragma to our `app.arc` manifest file. There is a specific syntax for setting the frequency for triggering our scheduled functions.

### Syntax

- Lower + upper case alphanumeric string
- Maximum of 240 characters
- Dashes, periods, and underscores are allowed
- Must begin with a letter
- Followed by a valid `rate` or `cron` expression ([more info here](https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html))

### Provision

This `app.arc` file defines some scheduled functions using both `cron` & `rate`:

```arc
@app
testapp

@scheduled
daily-update-buddy rate(1 day)
friday-only cron(0 15 ? * FRI *)
```

Which generates the following code:

```bash
/
├── src/
│   └── scheduled/
│       ├── daily-update-buddy/
│       └── friday-only/
├── app.arc
└── package.json
```

## Cron Expressions

Cron expressions allow us to give our functions granular settings. `crons` have six required fields, which are separated by white space.

| Field        | Values          | Wildcards     |
| ------------ | --------------- | ------------- |
| Minutes      | 0-59            | , - * /       |
| Hours        | 0-23            | , - * /       |
| Day-of-month | 1-31            | , - * ? / L W |
| Month        | 1-12 or JAN-DEC | , - * /       |
| Day-of-week  | 1-7 or SUN-SAT  | , - * ? L #   |
| Year         | 1970-2199       | , - * /       |

### Wildcards

- The (,) (comma) wildcard includes additional values. In the Month field, JAN, FEB, MAR would include January, February, and March.

- The - (dash) wildcard specifies ranges. In the Day field, 1-15 would include days 1 through 15 of the specified month.

- The * (asterisk) wildcard includes all values in the field. In the Hours field, * would include every hour. You cannot use * in both the Day-of-month and Day-of-week fields. If you use it in one, you must use ? in the other.

- The / (forward slash) wildcard specifies increments. In the Minutes field, you could enter 1/10 to specify every tenth minute, starting from the first minute of the hour (for example, the 11th, 21st, and 31st minute, and so on).

- The ? (question mark) wildcard specifies one or another. In the Day-of-month field, you could enter 7, and if you didn't care what day of the week the 7th was, you could enter ? in the Day-of-week field.

- The L wildcard in the Day-of-month or Day-of-week fields specifies the last day of the month or week.

- The W wildcard in the Day-of-month field specifies a weekday. In the Day-of-month field, `3W` specifies the weekday closest to the third day of the month.

- The # wildcard in the Day-of-week field specifies a particular instance of the specified day of the week within a month. For example, 3#2 would be the second Tuesday of the month: the 3 refers to Tuesday because it is the third day of each week, and the 2 refers to the second day of that type within the month.

> To dig deeper into `cron` expressions head [here to learn more.](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions)

## Rate Expressions

A `rate` expression is a lot less granular that a `cron` expression. `rate` expressions only have two required fields that are separated by white space.

### Rate expression syntax

**value**

A positive number that sets the numerical length of your `rate` expression.

**unit**

The unit of time. Different units are required for values of 1, such as minute, and values over 1, such as minutes.

Valid values: minute | minutes | hour | hours | day | days

**Restrictions**

If the value is equal to 1, then the unit must be singular. Similarly, for values greater than 1, the unit must be plural. For example, rate(1 hours) and rate(5 hour) are not valid, but rate(1 hour) and rate(5 hours) are valid.

## Examples

```arc
@app
testapp

# Example of `rate` & `cron` expressions
@scheduled
daily-update-buddy rate(1 day)
friday-only cron(0 15 ? * FRI *)
```
