---
title: '@app'
---

`@app` declares the application namespace

## Syntax

- Lowercase alphanumeric string
- Maximum of 10 characters
- Dashes allowed; underscores not allowed
- Must begin with a letter

## Example

Create an app with the namespace "foobaz":

<h5>arc</h5>

```arc
@app
foobaz
```

<h5>json</h5>

```json
{
  "app": "foobaz"
}
```

<h5>toml</h5>

```toml
app="foobaz"
```

<h5>yaml</h5>

```yaml
---
app: foobaz
```
