---
title: Database functions
description: A log of information about changes to items in a DynamoDB table
sections:
  - Overview
  - Getting started
  - Examples
---

## Overview

Architect database functions are a log of information about changes to items in a DynamoDB table. When you enable a stream on a table under the `@tables` pragma in your `app.arc` file, DynamoDB captures information about every modification to data items in the table.

This functionality is commonly used to stream data to other sources and provide data-based event triggers. (eg. when I add new user row to the accounts table …send a welcome email)

Database functions capture a time-ordered sequence of item-level modifications in any DynamoDB table and stores this information in a log for up to 24 hours. Applications can access this log and view the data items as they appeared before and after they were modified, in near-real-time.

Whenever an application creates, updates, or deletes items in the table, our database functions write a stream record with the primary key attributes of the items that were modified. A stream record contains information about a data modification to a single item in a DynamoDB table. You can configure the stream so that the stream records capture additional information, such as the "before" and "after" images of modified items.

> To better understand Architect database functions, check out [DynamoDB streams](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html) to learn more about this functionality.

## Getting started

You can create a database function with this syntax:

```bash
@tables
cats
  catID *String
  # Add `stream` and set to `true`.
  stream true
```

> `arc init` creates `src/tables/cats` local code and `arc deploy` to publishes to Lambda.

Architect provisions a lambda at `src/tables/cats/index.js` in your project, which gets an event for every write to your database (with a before/after of the data being written).


## Examples

**Node**

```javascript
exports.handler = async function stream(event) {
  console.log(event)
  return true
}
```

**Ruby**

```ruby
def handler(event)
  puts event
  true
end
```

**Python**

```python
def handler(event, context):
    print(event)
    return True
```
