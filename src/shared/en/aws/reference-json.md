# `@json`

## `@json` section defines HTTP routes that return `application/json` content

### Syntax
- Each route begins with `get` or `post` followed by the desired path
- Additional routes must include leading slash
- Dashes and underscores not allowed
- Must begin with a letter

### Additional bits
- Advised maximum of 100 characters
- Optional Express-style URL parameters denoted with colons (`:`)
- Currently only `GET` or `POST` methods are supported, [read more here](/intro/limits)

### Example

This `.arc` file defines some typical JSON routes:

```arc
@app
testapp

@json
get /notes          
get /notes/:noteID
post /notes                # create a note
post /notes/:noteID        # update a note
post /notes/:noteID/delete # delete a note
```

The `.arc` above generates the following REST-ish functions:

```bash
/
├── json
│   ├── get-notes/
│   ├── get-notes-000noteID/
│   ├── post-notes/
│   ├── post-notes-000noteID/
│   └── post-notes-000noteID-delete/
├── .arc
└── package.json
```

Note: The route `/notes/:noteID` corresponding handler deliberately looks a bit weird with the triple `000`. This is so you can quickly differentiate URL params from URL parts. The Lambda deploy targets follow suit:

- `testapp-staging-get-notes-000noteID`
- `testapp-production-get-notes-000noteID`

## Next: [Defining events with `@events`](/reference/events)
