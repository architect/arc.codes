# `npx repl`

> Read/evaluate/print/loop with DynamoDB using `.arc` defined `@tables` and `@indexes`

Helpful terminal access to your data.

## Example Usage

- `npx repl` connects to a local in memory representation of `.arc`
- `NODE_ENV=staging npx repl` connects to staging tables and indexes
- `NODE_ENV=production npx repl` connects to production tables and indexes

After the repl starts type: `data` to see the generated data layer.

> ⚠ NOTE: you have to have `@architect/data` installed in the root to use `npx repl`
