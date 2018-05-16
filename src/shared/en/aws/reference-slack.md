# `@slack`

## `@slack` defines Slack app HTTP handlers

Each defined Slack app gets a set of four HTTP handlers (API Gateway wired to Lambda) for:

- **events** [Slack Events API](https://api.slack.com/events-api)
- **actions** [Interactive Messages](https://api.slack.com/interactive-messages) (buttons and menus)
- **options** [Dynamic Options](https://api.slack.com/docs/message-menus#menu_dynamic) (populating menus dynamically)
- **slash** [Slash Commands](https://api.slack.com/slash-commands)

Read more about [creating Slack apps here](https://api.slack.com/slack-apps#creating_apps).

### Validation
- Lowercase alphanumeric string
- Maximum of 50 characters
- Dashes allowed; underscores not allowed
- Must begin with a letter

### Additional bits
- `@slack` requires at least one `@html` or `@json` route handler created
  - You probably want to have `@html` `get` routes for [Add to Slack](https://api.slack.com/docs/slack-button) and [Sign in with Slack](https://api.slack.com/docs/sign-in-with-slack) buttons anyhow.
- Protip: all the generated handlers come installed with [Slack](https://www.npmjs.com/package/slack)

### Example

This `.arc` file defines two Slack apps:

```arc
@app
testapp

@html
get /

@slack
hello-bot
rando-emoji
```

Given the `.arc` file above `npx create` generates the following functions:

```bash
/
├── html
│   └── get-index/
├── slack
│   ├── hello-bot-actions/
│   ├── hello-bot-events/
│   ├── hello-bot-options/
│   ├── hello-bot-slash/
│   ├── rando-emoji-actions/
│   ├── rando-emoji-events/
│   ├── rando-emoji-options/
│   └── rando-emoji-slash/
├── .arc
└── package.json
```

This is a complete Slack app example `.arc` file:

```arc
@app
testapp

@slack
bot

@html
get /
get /sign-in-with-slack
get /add-to-slack
```

Results in the following code:

```bash
/
├── html
│   ├── get-add-to-slack/
│   ├── get-sign-in-with-slack/
│   └── get-index/
├── slack
│   ├── bot-actions/
│   ├── bot-events/
│   ├── bot-options/
│   └── bot-slash/
├── .arc
└── package.json
```

## Next: [Defining tables with `@tables`](/reference/tables)
