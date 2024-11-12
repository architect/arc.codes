---
title: Download a Begin environment's data
description:
---

Begin was a common means of deploying Architect apps, and a long-time sponsor of the Architect project. Prior to the shutdown of Begin, customers can download their environment data for use in Architect apps like so:


## Usage

Node.js 20.x+ is required.

Use this script to download a Begin app environment's data. Either a single table (recommended) or all tables.

First, create a script file:

```bash
touch ./begin-download.mjs
```

Then paste in the [script contents below](#download-script).

This program will use your stored Begin credentials, and ask for an `appID`, `envID`, and the name of your table.
A `.json` file will be saved to disk alongside the `begin-download.mjs` file:

```javascript
// data-appID-envID-tables.json
[
  {
    name: String,
    info: DynamoDB.TableDescription,
    items: [DynamoDB.Item],
    complete: Boolean, // true, if the entire table was downloaded
  }
]
```

When ready, run it like so:

```bash
node begin-download.mjs
```


## 100MB Limit

If the requested table (or all tables when no table name is specified) exceeds 100MB, partial data will be returned.
If you encounter this, you can request a custom export via [Discord](https://discord.com/invite/y5A2eTsCRX) or support@begin.com.

## Notes

Retrieve app and env IDs with the Begin CLI:

```bash
begin list
# or, if the CLI isn't installed:
npx @begin/deploy@latest list
```

Refer to your application's `*.arc` file for a list of table names.

---

## Download script

```javascript
// begin-download.mjs
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import readline from 'node:readline'
import url from 'node:url'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const currentDir = path.dirname(url.fileURLToPath(import.meta.url))
const homeDir = process.env.HOME || process.env.USERPROFILE || '~'
const configPath = path.join(homeDir, '.begin', 'config.json')

function question (query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function main() {
  let TOKEN
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    TOKEN = config.access_token
    if (!TOKEN) throw 'access_token not found in Begin config'
  } catch (error) {
    TOKEN = question('Enter Begin API access token: ')
  }
  if (!TOKEN) throw 'Begin API token required!'

  const APP_ID = await question('Enter appID: ')
  if (APP_ID.length < 8) throw 'appID required'
  const ENV_ID = await question('Enter envID: ')
  if (ENV_ID.length < 8) throw 'envID required'
  const TABLE = await question('Enter table name (optional, press Enter to skip): ')

  let URL = 'https://api.begin.com/v1'
  URL += `/apps/${APP_ID}/${ENV_ID}/data`
  if (TABLE) URL += `?table=${TABLE}`

  const response = await fetch(
    URL,
    {
      headers: {
        authorization: `bearer ${TOKEN}`,
        'content-type': 'application/json',
      },
    }
  )

  if (!response.ok) throw `ERROR: ${await response.text()}`

  const tables = await response.json()

  if (!tables || tables.length === 0) throw 'No data returned'

  let filename = `data-${APP_ID}-${ENV_ID}-${TABLE ? `${TABLE}` : 'tables'}.json`
  fs.writeFileSync(
    path.join(currentDir, filename),
    JSON.stringify(tables, null, 2),
  )

  for (const { info, name, items, complete } of tables) {
    console.log(`\nTable "${name}"`)
    if (!complete) console.log('Incomplete scan! Table too large.')
    console.log(`  <${info.TableId}>`)
    console.log(`  (${items.length} items)`)
  }

  console.log(`\nSaved ./${filename}`)

  rl.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```
