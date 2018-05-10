# `@slack`

## `@slack` defines Slack app HTTP handlers.

This `.arc` file defines two bots:

```arc
@app
testapp

@html
get /

@slack
hello-bot
rando-emoji
```

Given the `.arc` file above `npm run create` generates the following functions:

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

Each bot gets API Gateway wired to Lambda handlers for:

- **events** [Slack Events API](https://api.slack.com/events-api)
- **actions** [Interactive Messages](https://api.slack.com/interactive-messages) (buttons and menus)
- **options** [Dynamic Options](https://api.slack.com/docs/message-menus#menu_dynamic) (populating menus dynamically)
- **slash** [Slash Commands](https://api.slack.com/slash-commands)

Note: `@slack` requires at least one `@html` or `@json` route handler created. You probably want to have `@html` `get` routes for [Add to Slack](https://api.slack.com/docs/slack-button) and [Sign in with Slack](https://api.slack.com/docs/sign-in-with-slack) buttons anyhow.

This is a complete bot app example `.arc` file:

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
│   ├── get-sign-in-with-slack/
│   ├── get-add-to-slack/
│   └── get-index/
├── slack
│   ├── bot-actions/
│   ├── bot-events/
│   ├── bot-options/
│   └── bot-slash/
├── .arc
└── package.json
```

> Protip: all the generated handlers come installed with [Slack](https://www.npmjs.com/package/slack)

Read more about [creating Slackbots here](https://api.slack.com/slack-apps#creating_apps).

## Next: [Defining tables with `@tables`](/reference/tables)
