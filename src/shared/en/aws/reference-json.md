# `@json`

## `@json` section defines HTTP routes that return `application/json` content

### Syntax

- Each route begins with `get`, `post`, `put`, `patch` or `delete` followed by the desired path
- Dashes and underscores are not allowed
- Maximum length of 100 characters
- Optional Express-style URL parameters denoted with colons (`:`)

### Example

This `.arc` file defines some typical JSON routes:

```arc
@app
testapp

@json
get /notes          
get /notes/:noteID
post /notes           # create a note
put /notes/:noteID    # update a note
delete /notes/:noteID # delete a note
```

The `.arc` above generates the following REST functions:

```bash
/
├── json
│   ├── get-notes/
│   ├── get-notes-000noteID/
│   ├── post-notes/
│   ├── put-notes-000noteID/
│   └── delete-notes-000noteID/
├── .arc
└── package.json
```

Note: The route `/notes/:noteID` corresponding handler deliberately looks a bit weird with the triple `000`. This is so you can quickly differentiate URL params from URL parts. The Lambda deploy targets follow suit:

- `testapp-staging-get-notes-000noteID`
- `testapp-production-get-notes-000noteID`

## Next: [Creating queues with `@queues`](/reference/queues)
